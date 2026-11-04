const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GGBoard Smart Contract", function () {
  let ggboard;
  let owner, player1, player2, player3, nonPlayer;

  beforeEach(async function () {
    [owner, player1, player2, player3, nonPlayer] = await ethers.getSigners();

    const GGBoardFactory = await ethers.getContractFactory("GGBoard");
    ggboard = await GGBoardFactory.deploy();
    await ggboard.waitForDeployment();
  });

  describe("1. Profile Registration", function () {
    it("Should register a profile successfully", async function () {
      await expect(ggboard.connect(player1).registerProfile("GamerOne"))
        .to.emit(ggboard, "ProfileRegistered")
        .withArgs(player1.address, "GamerOne", (await ethers.provider.getBlock("latest")).timestamp + 1);

      const profile = await ggboard.getPlayerProfile(player1.address);
      expect(profile.username).to.equal("GamerOne");
      expect(profile.totalWins).to.equal(0);
      expect(profile.totalLosses).to.equal(0);
      expect(profile.totalMatches).to.equal(0);
      expect(profile.isRegistered).to.be.true;

      expect(await ggboard.totalGamers()).to.equal(1);
    });

    it("Should prevent duplicate registration from the same wallet", async function () {
      await ggboard.connect(player1).registerProfile("GamerOne");

      await expect(
        ggboard.connect(player1).registerProfile("GamerOneAgain")
      ).to.be.revertedWithCustomError(ggboard, "AlreadyRegistered");
    });

    it("Should prevent registration with empty or too long usernames", async function () {
      await expect(
        ggboard.connect(player1).registerProfile("")
      ).to.be.revertedWithCustomError(ggboard, "InvalidUsername");

      const longUsername = "a".repeat(33);
      await expect(
        ggboard.connect(player1).registerProfile(longUsername)
      ).to.be.revertedWithCustomError(ggboard, "InvalidUsername");
    });
  });

  describe("2. Match Submission", function () {
    beforeEach(async function () {
      await ggboard.connect(player1).registerProfile("Alpha");
      await ggboard.connect(player2).registerProfile("Bravo");
    });

    it("Should submit a match and create a pending record", async function () {
      await expect(ggboard.connect(player1).submitMatch(player2.address, 16, 12))
        .to.emit(ggboard, "MatchSubmitted");

      expect(await ggboard.totalMatches()).to.equal(1);

      const matches = await ggboard.getPlayerMatches(player1.address);
      expect(matches.length).to.equal(1);

      const m = matches[0];
      expect(m.matchId).to.equal(0);
      expect(m.playerOne).to.equal(player1.address);
      expect(m.playerTwo).to.equal(player2.address);
      expect(m.playerOneScore).to.equal(16);
      expect(m.playerTwoScore).to.equal(12);
      expect(m.winner).to.equal(player1.address);
      expect(m.status).to.equal(0); // Pending

      // Statistics must NOT update upon submission
      const p1Profile = await ggboard.getPlayerProfile(player1.address);
      const p2Profile = await ggboard.getPlayerProfile(player2.address);
      expect(p1Profile.totalWins).to.equal(0);
      expect(p2Profile.totalLosses).to.equal(0);
      expect(p1Profile.totalMatches).to.equal(0);
      expect(p2Profile.totalMatches).to.equal(0);
    });

    it("Should prevent recording matches against self", async function () {
      await expect(
        ggboard.connect(player1).submitMatch(player1.address, 10, 5)
      ).to.be.revertedWithCustomError(ggboard, "CannotPlaySelf");
    });

    it("Should prevent recording matches with unregistered opponent or invalid address", async function () {
      await expect(
        ggboard.connect(player1).submitMatch(ethers.ZeroAddress, 10, 5)
      ).to.be.revertedWithCustomError(ggboard, "InvalidOpponent");

      await expect(
        ggboard.connect(player1).submitMatch(nonPlayer.address, 10, 5)
      ).to.be.revertedWithCustomError(ggboard, "OpponentNotRegistered");
    });

    it("Should prevent submitting tied scores", async function () {
      await expect(
        ggboard.connect(player1).submitMatch(player2.address, 10, 10)
      ).to.be.revertedWithCustomError(ggboard, "ScoresCannotBeTied");
    });

    it("Should correctly identify playerTwo as winner when opponent has higher score", async function () {
      await ggboard.connect(player1).submitMatch(player2.address, 8, 15);
      const matches = await ggboard.getPlayerMatches(player1.address);
      expect(matches[0].winner).to.equal(player2.address);
    });
  });

  describe("3. Match Confirmation & Statistics Update", function () {
    beforeEach(async function () {
      await ggboard.connect(player1).registerProfile("Alpha");
      await ggboard.connect(player2).registerProfile("Bravo");
      // Player 1 submits match where player 1 wins (15 to 10)
      await ggboard.connect(player1).submitMatch(player2.address, 15, 10);
    });

    it("Should allow the opponent to confirm match and update stats properly", async function () {
      await expect(ggboard.connect(player2).confirmMatch(0))
        .to.emit(ggboard, "MatchConfirmed")
        .withArgs(0, player2.address, player1.address, (await ethers.provider.getBlock("latest")).timestamp + 1);

      // Verify status
      const matches = await ggboard.getPlayerMatches(player1.address);
      expect(matches[0].status).to.equal(1); // Confirmed

      // Verify winner stats (Player 1)
      const p1 = await ggboard.getPlayerProfile(player1.address);
      expect(p1.totalWins).to.equal(1);
      expect(p1.totalLosses).to.equal(0);
      expect(p1.totalMatches).to.equal(1);

      // Verify loser stats (Player 2)
      const p2 = await ggboard.getPlayerProfile(player2.address);
      expect(p2.totalWins).to.equal(0);
      expect(p2.totalLosses).to.equal(1);
      expect(p2.totalMatches).to.equal(1);
    });

    it("Should reject unauthorized confirmation attempts", async function () {
      // Submitter cannot confirm their own submitted match
      await expect(
        ggboard.connect(player1).confirmMatch(0)
      ).to.be.revertedWithCustomError(ggboard, "OnlyOpponentCanConfirm");

      // Random third party cannot confirm
      await ggboard.connect(player3).registerProfile("Charlie");
      await expect(
        ggboard.connect(player3).confirmMatch(0)
      ).to.be.revertedWithCustomError(ggboard, "OnlyOpponentCanConfirm");
    });

    it("Should prevent duplicate confirmation", async function () {
      await ggboard.connect(player2).confirmMatch(0);

      // Second confirmation attempt
      await expect(
        ggboard.connect(player2).confirmMatch(0)
      ).to.be.revertedWithCustomError(ggboard, "NotPending");
    });
  });

  describe("4. Match Rejection", function () {
    beforeEach(async function () {
      await ggboard.connect(player1).registerProfile("Alpha");
      await ggboard.connect(player2).registerProfile("Bravo");
      await ggboard.connect(player1).submitMatch(player2.address, 15, 10);
    });

    it("Should allow the opponent to reject match and not update statistics", async function () {
      await expect(ggboard.connect(player2).rejectMatch(0))
        .to.emit(ggboard, "MatchRejected")
        .withArgs(0, player2.address, (await ethers.provider.getBlock("latest")).timestamp + 1);

      const matches = await ggboard.getPlayerMatches(player1.address);
      expect(matches[0].status).to.equal(2); // Rejected

      // Statistics must remain 0
      const p1 = await ggboard.getPlayerProfile(player1.address);
      const p2 = await ggboard.getPlayerProfile(player2.address);
      expect(p1.totalWins).to.equal(0);
      expect(p1.totalLosses).to.equal(0);
      expect(p1.totalMatches).to.equal(0);
      expect(p2.totalWins).to.equal(0);
      expect(p2.totalLosses).to.equal(0);
      expect(p2.totalMatches).to.equal(0);
    });

    it("Should reject unauthorized rejection attempts", async function () {
      await expect(
        ggboard.connect(player1).rejectMatch(0)
      ).to.be.revertedWithCustomError(ggboard, "OnlyOpponentCanReject");
    });

    it("Should prevent confirming an already rejected match", async function () {
      await ggboard.connect(player2).rejectMatch(0);
      await expect(
        ggboard.connect(player2).confirmMatch(0)
      ).to.be.revertedWithCustomError(ggboard, "NotPending");
    });
  });

  describe("5. Leaderboard and Rankings", function () {
    it("Should rank players by total wins, then tiebreak by fewer losses", async function () {
      await ggboard.connect(player1).registerProfile("Alice");
      await ggboard.connect(player2).registerProfile("Bob");
      await ggboard.connect(player3).registerProfile("Charlie");

      // Match 1: Alice beats Bob
      await ggboard.connect(player1).submitMatch(player2.address, 10, 5);
      await ggboard.connect(player2).confirmMatch(0);

      // Match 2: Charlie beats Bob
      await ggboard.connect(player3).submitMatch(player2.address, 12, 8);
      await ggboard.connect(player2).confirmMatch(1);

      // Match 3: Charlie beats Alice
      await ggboard.connect(player3).submitMatch(player1.address, 15, 14);
      await ggboard.connect(player1).confirmMatch(2);

      // Current Standings:
      // Charlie: 2 wins, 0 losses
      // Alice: 1 win, 1 loss
      // Bob: 0 wins, 2 losses

      const leaderboard = await ggboard.getLeaderboard();
      expect(leaderboard.length).to.equal(3);

      expect(leaderboard[0].username).to.equal("Charlie");
      expect(leaderboard[0].totalWins).to.equal(2);

      expect(leaderboard[1].username).to.equal("Alice");
      expect(leaderboard[1].totalWins).to.equal(1);

      expect(leaderboard[2].username).to.equal("Bob");
      expect(leaderboard[2].totalWins).to.equal(0);
    });
  });
});

