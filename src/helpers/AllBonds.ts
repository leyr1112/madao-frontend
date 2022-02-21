import { StableBond, LPBond, NetworkID, CustomBond, BondType } from "src/lib/Bond";
import { addresses } from "src/constants";

import { ReactComponent as BusdImg } from "src/assets/tokens/BUSD.svg";
import { ReactComponent as MadaoBusdimg } from "src/assets/tokens/MADAO-BUSD.svg";

import { abi as MadaoBusdContract } from "src/abi/bonds/MadaoBusdContract.json";
import { abi as BusdBondContract } from "src/abi/bonds/BusdContract.json";
import { abi as ReserveMadaoBusdContract } from "src/abi/reserves/MadaoBusd.json";

export const busd = new StableBond({
  name: "busd",
  displayName: "BUSD",
  bondToken: "BUSD",
  bondIconSvg: BusdImg,
  bondContractABI: BusdBondContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xF48cdF1942D3F0Eb87C4b19A46213C050D6EA939",
      reserveAddress: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xF651283543fB9D61A91f318b78385d187D300738",
      reserveAddress: "0x2F7249cb599139e560f0c81c269Ab9b04799E453",
    },
  },
});

export const madao_busd = new LPBond({
  name: "madao_busd_lp",
  displayName: "MADAO-BUSD LP",
  bondToken: "BUSD",
  bondIconSvg: MadaoBusdimg,
  bondContractABI: MadaoBusdContract,
  reserveContract: ReserveMadaoBusdContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x16293E69Fe72532d37D222326Cf83E3c83306b34",
      reserveAddress: "0x09D82c923bB9C46539DA8179dDe7F87dA0DEA9Cf",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xcF449dA417cC36009a1C6FbA78918c31594B9377",
      reserveAddress: "0x8D5a22Fb6A1840da602E56D1a260E56770e0bCE2",
    },
  },
  lpUrl:
    "https://pancakeswap.finance/add/0x429EE8cc1200bE3aaDBc2641c635ef174a8deE89/0xe9e7cea3dedca5984780bafc599bd69add087d56",
});

// HOW TO ADD A NEW BOND:
// Is it a stableCoin bond? use `new StableBond`
// Is it an LP Bond? use `new LPBond`
// Add new bonds to this array!!
export const allBonds = [busd, madao_busd];
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

// Debug Log
// console.log(allBondsMap);
export default allBonds;
