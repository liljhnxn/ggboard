export const GGBOARD_ABI = [
  {
    "type": "function",
    "name": "registerProfile",
    "inputs": [{ "name": "username", "type": "string", "internalType": "string" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "submitMatch",
    "inputs": [
      { "name": "opponent", "type": "address", "internalType": "address" },
      { "name": "myScore", "type": "uint32", "internalType": "uint32" },
      { "name": "opponentScore", "type": "uint32", "internalType": "uint32" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "confirmMatch",
    "inputs": [{ "name": "matchId", "type": "uint256", "internalType": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "rejectMatch",
    "inputs": [{ "name": "matchId", "type": "uint256", "internalType": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "totalGamers",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalMatches",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPlayerProfile",
    "inputs": [{ "name": "player", "type": "address", "internalType": "address" }],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct GGBoard.Profile",
        "components": [
          { "name": "username", "type": "string", "internalType": "string" },
          { "name": "totalWins", "type": "uint32", "internalType": "uint32" },
          { "name": "totalLosses", "type": "uint32", "internalType": "uint32" },
          { "name": "totalMatches", "type": "uint32", "internalType": "uint32" },
          { "name": "isRegistered", "type": "bool", "internalType": "bool" },
          { "name": "registeredAt", "type": "uint256", "internalType": "uint256" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPlayerMatches",
    "inputs": [{ "name": "player", "type": "address", "internalType": "address" }],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct GGBoard.MatchRecord[]",
        "components": [
          { "name": "matchId", "type": "uint256", "internalType": "uint256" },
          { "name": "playerOne", "type": "address", "internalType": "address" },
          { "name": "playerTwo", "type": "address", "internalType": "address" },
          { "name": "playerOneScore", "type": "uint32", "internalType": "uint32" },
          { "name": "playerTwoScore", "type": "uint32", "internalType": "uint32" },
          { "name": "winner", "type": "address", "internalType": "address" },
          { "name": "status", "type": "uint8", "internalType": "enum GGBoard.MatchStatus" },
          { "name": "timestamp", "type": "uint256", "internalType": "uint256" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPendingMatchesForPlayer",
    "inputs": [{ "name": "opponent", "type": "address", "internalType": "address" }],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct GGBoard.MatchRecord[]",
        "components": [
          { "name": "matchId", "type": "uint256", "internalType": "uint256" },
          { "name": "playerOne", "type": "address", "internalType": "address" },
          { "name": "playerTwo", "type": "address", "internalType": "address" },
          { "name": "playerOneScore", "type": "uint32", "internalType": "uint32" },
          { "name": "playerTwoScore", "type": "uint32", "internalType": "uint32" },
          { "name": "winner", "type": "address", "internalType": "address" },
          { "name": "status", "type": "uint8", "internalType": "enum GGBoard.MatchStatus" },
          { "name": "timestamp", "type": "uint256", "internalType": "uint256" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAllMatches",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct GGBoard.MatchRecord[]",
        "components": [
          { "name": "matchId", "type": "uint256", "internalType": "uint256" },
          { "name": "playerOne", "type": "address", "internalType": "address" },
          { "name": "playerTwo", "type": "address", "internalType": "address" },
          { "name": "playerOneScore", "type": "uint32", "internalType": "uint32" },
          { "name": "playerTwoScore", "type": "uint32", "internalType": "uint32" },
          { "name": "winner", "type": "address", "internalType": "address" },
          { "name": "status", "type": "uint8", "internalType": "enum GGBoard.MatchStatus" },
          { "name": "timestamp", "type": "uint256", "internalType": "uint256" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getLeaderboard",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct GGBoard.PlayerStats[]",
        "components": [
          { "name": "playerAddress", "type": "address", "internalType": "address" },
          { "name": "username", "type": "string", "internalType": "string" },
          { "name": "totalWins", "type": "uint32", "internalType": "uint32" },
          { "name": "totalLosses", "type": "uint32", "internalType": "uint32" },
          { "name": "totalMatches", "type": "uint32", "internalType": "uint32" },
          { "name": "registeredAt", "type": "uint256", "internalType": "uint256" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "ProfileRegistered",
    "inputs": [
      { "name": "player", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "username", "type": "string", "indexed": false, "internalType": "string" },
      { "name": "timestamp", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "MatchSubmitted",
    "inputs": [
      { "name": "matchId", "type": "uint256", "indexed": true, "internalType": "uint256" },
      { "name": "playerOne", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "playerTwo", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "playerOneScore", "type": "uint32", "indexed": false, "internalType": "uint32" },
      { "name": "playerTwoScore", "type": "uint32", "indexed": false, "internalType": "uint32" },
      { "name": "winner", "type": "address", "indexed": false, "internalType": "address" },
      { "name": "timestamp", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "MatchConfirmed",
    "inputs": [
      { "name": "matchId", "type": "uint256", "indexed": true, "internalType": "uint256" },
      { "name": "opponent", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "winner", "type": "address", "indexed": false, "internalType": "address" },
      { "name": "timestamp", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "MatchRejected",
    "inputs": [
      { "name": "matchId", "type": "uint256", "indexed": true, "internalType": "uint256" },
      { "name": "opponent", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "timestamp", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  }
] as const;

export const DEFAULT_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "0x5e1ae0a3D053755BB203894dC6C97B951254a7A0") as `0x${string}`;

