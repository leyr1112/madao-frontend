export const THE_GRAPH_URL = "https://api.thegraph.com/subgraphs/name/wkich/madao-subgraph";
export const EPOCH_INTERVAL = 9600;

// NOTE could get this from an outside source since it changes slightly over time
export const BLOCK_RATE_SECONDS = 3;

export const TOKEN_DECIMALS = 9;

interface IAddresses {
  [key: number]: { [key: string]: string };
}

export const addresses: IAddresses = {
  56: {
    BUSD_ADDRESS: "0xe9e7cea3dedca5984780bafc599bd69add087d56", // duplicate
    MADAO_ADDRESS: "0x429EE8cc1200bE3aaDBc2641c635ef174a8deE89",
    STAKING_ADDRESS: "0x4060dc11e57FBb850A72747db58E596034026EBe", // The new staking contract
    STAKING_HELPER_ADDRESS: "0x9Ebb9fc7BEbaD2cB8cf05e55D628545B3a1baB49", // Helper contract used for Staking only
    SMADAO_ADDRESS: "0x4fAc07b33BaaD140b587fee4A38C197b97401E5b",
    DISTRIBUTOR_ADDRESS: "0x41c7F2Dcc3d3DAAF2144398FCbEE4c3cBB5f2144",
    BONDINGCALC_ADDRESS: "0x71Dd24c00079B16736D5a8e13AC1097dA0684B18",
    TREASURY_ADDRESS: "0xB8C10906574a3E4F16D4e55061f70c53e44CFF9e",
    REDEEM_HELPER_ADDRESS: "0x16605CA96c949f27f767435157a43942a1F18c8c",
    // MANFT_ADDRESS: "0x32F95B6522c232Ef7643dA7F83c4e02d4a491F4D", // test version
    MANFT_ADDRESS: "0x616c5CDF31488C96c98addf99DA24730Fe8ABC81", // real token    
    // MANFTSTAKING_ADDRESS: "0xFfa11544C0F0B32Caaf9616dbfeC8eF68dED2B4f", // test version
    MANFTSTAKING_ADDRESS: "0x7309a80b5B0c5839F0eDb934f89c65d262Be0ceb", // real version
    BNBBUSDLP_ADDRESS: "0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16"
  },
};