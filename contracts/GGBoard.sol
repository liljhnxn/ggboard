// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title GGBoard
 * @notice On-chain competitive gaming scoreboard with peer-confirmed match verification.
 */
contract GGBoard {
    enum MatchStatus {
        Pending,
        Confirmed,
        Rejected
    }

    struct Profile {
        string username;
        uint32 totalWins;
        uint32 totalLosses;
        uint32 totalMatches;
        bool isRegistered;
        uint256 registeredAt;
    }

    struct MatchRecord {
        uint256 matchId;
        address playerOne;
        address playerTwo;
        uint32 playerOneScore;
        uint32 playerTwoScore;
        address winner;
        MatchStatus status;
        uint256 timestamp;
    }

    struct PlayerStats {
        address playerAddress;
        string username;
        uint32 totalWins;
        uint32 totalLosses;
        uint32 totalMatches;
        uint256 registeredAt;
    }

    // Storage
    mapping(address => Profile) public profiles;
    address[] public playerAddresses;

    MatchRecord[] public matches;
    mapping(address => uint256[]) private _playerMatchIds;

    // Events
    event ProfileRegistered(address indexed player, string username, uint256 timestamp);
    event MatchSubmitted(
        uint256 indexed matchId,
        address indexed playerOne,
        address indexed playerTwo,
        uint32 playerOneScore,
        uint32 playerTwoScore,
        address winner,
        uint256 timestamp
    );
    event MatchConfirmed(uint256 indexed matchId, address indexed opponent, address winner, uint256 timestamp);
    event MatchRejected(uint256 indexed matchId, address indexed opponent, uint256 timestamp);

    // Custom errors for clarity and gas efficiency
    error AlreadyRegistered();
    error NotRegistered();
    error OpponentNotRegistered();
    error InvalidUsername();
    error CannotPlaySelf();
    error InvalidOpponent();
    error ScoresCannotBeTied();
    error MatchNotFound();
    error NotPending();
    error OnlyOpponentCanConfirm();
    error OnlyOpponentCanReject();

    modifier onlyRegistered() {
        if (!profiles[msg.sender].isRegistered) revert NotRegistered();
        _;
    }

    /**
     * @notice Register a gamer profile with a unique username
     * @param username Desired gamer username (1-32 chars)
     */
    function registerProfile(string calldata username) external {
        if (profiles[msg.sender].isRegistered) revert AlreadyRegistered();
        bytes memory usernameBytes = bytes(username);
        if (usernameBytes.length == 0 || usernameBytes.length > 32) revert InvalidUsername();

        profiles[msg.sender] = Profile({
            username: username,
            totalWins: 0,
            totalLosses: 0,
            totalMatches: 0,
            isRegistered: true,
            registeredAt: block.timestamp
        });

        playerAddresses.push(msg.sender);

        emit ProfileRegistered(msg.sender, username, block.timestamp);
    }

    /**
     * @notice Submit a match result against an opponent. Creates a pending match.
     * @param opponent Wallet address of the opponent
     * @param myScore The submitter's score
     * @param opponentScore The opponent's score
     */
    function submitMatch(address opponent, uint32 myScore, uint32 opponentScore) external onlyRegistered {
        if (opponent == address(0)) revert InvalidOpponent();
        if (opponent == msg.sender) revert CannotPlaySelf();
        if (!profiles[opponent].isRegistered) revert OpponentNotRegistered();
        if (myScore == opponentScore) revert ScoresCannotBeTied();

        address winner = myScore > opponentScore ? msg.sender : opponent;
        uint256 matchId = matches.length;

        MatchRecord memory record = MatchRecord({
            matchId: matchId,
            playerOne: msg.sender,
            playerTwo: opponent,
            playerOneScore: myScore,
            playerTwoScore: opponentScore,
            winner: winner,
            status: MatchStatus.Pending,
            timestamp: block.timestamp
        });

        matches.push(record);
        _playerMatchIds[msg.sender].push(matchId);
        _playerMatchIds[opponent].push(matchId);

        emit MatchSubmitted(matchId, msg.sender, opponent, myScore, opponentScore, winner, block.timestamp);
    }

    /**
     * @notice Confirm a pending match submitted by an opponent. Updates statistics.
     * @param matchId The ID of the match to confirm
     */
    function confirmMatch(uint256 matchId) external onlyRegistered {
        if (matchId >= matches.length) revert MatchNotFound();
        MatchRecord storage m = matches[matchId];

        if (m.status != MatchStatus.Pending) revert NotPending();
        if (m.playerTwo != msg.sender) revert OnlyOpponentCanConfirm();

        m.status = MatchStatus.Confirmed;

        address loser = (m.winner == m.playerOne) ? m.playerTwo : m.playerOne;

        // Automatically update statistics
        profiles[m.winner].totalWins += 1;
        profiles[m.winner].totalMatches += 1;

        profiles[loser].totalLosses += 1;
        profiles[loser].totalMatches += 1;

        emit MatchConfirmed(matchId, msg.sender, m.winner, block.timestamp);
    }

    /**
     * @notice Reject an incorrect match result submitted by an opponent.
     * @param matchId The ID of the match to reject
     */
    function rejectMatch(uint256 matchId) external onlyRegistered {
        if (matchId >= matches.length) revert MatchNotFound();
        MatchRecord storage m = matches[matchId];

        if (m.status != MatchStatus.Pending) revert NotPending();
        if (m.playerTwo != msg.sender) revert OnlyOpponentCanReject();

        m.status = MatchStatus.Rejected;

        emit MatchRejected(matchId, msg.sender, block.timestamp);
    }

    // View Functions

    function totalGamers() external view returns (uint256) {
        return playerAddresses.length;
    }

    function totalMatches() external view returns (uint256) {
        return matches.length;
    }

    function getPlayerProfile(address player) external view returns (Profile memory) {
        return profiles[player];
    }

    /**
     * @notice Retrieve all matches involving a player
     * @param player Wallet address of the player
     */
    function getPlayerMatches(address player) external view returns (MatchRecord[] memory) {
        uint256[] storage ids = _playerMatchIds[player];
        MatchRecord[] memory list = new MatchRecord[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            list[i] = matches[ids[i]];
        }
        return list;
    }

    /**
     * @notice Retrieve all matches that are pending confirmation for an opponent
     * @param opponent Wallet address of the opponent
     */
    function getPendingMatchesForPlayer(address opponent) external view returns (MatchRecord[] memory) {
        uint256[] storage ids = _playerMatchIds[opponent];
        uint256 count = 0;
        for (uint256 i = 0; i < ids.length; i++) {
            MatchRecord storage m = matches[ids[i]];
            if (m.playerTwo == opponent && m.status == MatchStatus.Pending) {
                count++;
            }
        }

        MatchRecord[] memory pending = new MatchRecord[](count);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < ids.length; i++) {
            MatchRecord storage m = matches[ids[i]];
            if (m.playerTwo == opponent && m.status == MatchStatus.Pending) {
                pending[currentIndex] = m;
                currentIndex++;
            }
        }
        return pending;
    }

    /**
     * @notice Returns all matches in descending order (most recent first)
     */
    function getAllMatches() external view returns (MatchRecord[] memory) {
        uint256 len = matches.length;
        MatchRecord[] memory all = new MatchRecord[](len);
        for (uint256 i = 0; i < len; i++) {
            all[i] = matches[len - 1 - i];
        }
        return all;
    }

    /**
     * @notice Returns all registered players with their stats
     */
    function getAllPlayers() public view returns (PlayerStats[] memory) {
        uint256 len = playerAddresses.length;
        PlayerStats[] memory list = new PlayerStats[](len);
        for (uint256 i = 0; i < len; i++) {
            address addr = playerAddresses[i];
            Profile storage p = profiles[addr];
            list[i] = PlayerStats({
                playerAddress: addr,
                username: p.username,
                totalWins: p.totalWins,
                totalLosses: p.totalLosses,
                totalMatches: p.totalMatches,
                registeredAt: p.registeredAt
            });
        }
        return list;
    }

    /**
     * @notice Returns ranked players for the public leaderboard.
     * Ranked by totalWins (descending). Tie-breaker: totalLosses (ascending), then registeredAt (ascending).
     */
    function getLeaderboard() external view returns (PlayerStats[] memory) {
        PlayerStats[] memory list = getAllPlayers();
        uint256 n = list.length;
        if (n <= 1) return list;

        // In-memory insertion sort
        for (uint256 i = 1; i < n; i++) {
            PlayerStats memory key = list[i];
            int256 j = int256(i) - 1;

            while (j >= 0 && _isHigherRank(key, list[uint256(j)])) {
                list[uint256(j + 1)] = list[uint256(j)];
                j--;
            }
            list[uint256(j + 1)] = key;
        }

        return list;
    }

    function _isHigherRank(PlayerStats memory a, PlayerStats memory b) private pure returns (bool) {
        if (a.totalWins != b.totalWins) {
            return a.totalWins > b.totalWins;
        }
        // Tie-breaker 1: Fewer losses
        if (a.totalLosses != b.totalLosses) {
            return a.totalLosses < b.totalLosses;
        }
        // Tie-breaker 2: Registered earlier
        return a.registeredAt < b.registeredAt;
    }
}

