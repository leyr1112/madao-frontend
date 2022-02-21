import { useState } from "react";
import {
  Paper,
  Grid,
  Typography,
  Box,
  Zoom,
  useMediaQuery,
  Button,
  FormControlLabel,
  Switch,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useDispatch, useSelector } from "react-redux";
import { trim, formatCurrency } from "../../helpers";
import { error } from "../../slices/MessagesSlice";
import { ethers, BigNumber } from "ethers";

import "./nftstake.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { onUnStakeAll, onHarvest } from "src/slices/NftMintSlice";
import NftCard from "./NftCard";

function NftStake() {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();
  const isAppLoading = useSelector(state => state.nftMint.loading);

  const [zoomed, setZoomed] = useState(false);
  const btnVarient = false ? "contained" : "outlined";
  const [statusText, setStatusText] = useState("Staked Only");
  const [stakedStatus, setStakedStatus] = useState(true);

  const handleChange = stakedStatus => {
    setStatusText(stakedStatus ? "Unstaked Only" : "Staked Only");
    setStakedStatus(!stakedStatus);
  };

  const smallerScreen = useMediaQuery("(max-width: 650px)");
  const verySmallScreen = useMediaQuery("(max-width: 379px)");

  const price = useSelector(state => {
    return state.nftMint.price;
  });

  const marketPrice = useSelector(state => {
    return state.app.marketPrice;
  });

  const tokensOfOwner = useSelector(state => {
    return state.nftMint.tokensOfOwner;
  });

  const balanceOf = useSelector(state => {
    return state.nftMint.balanceOf;
  });

  const stakedTokens = useSelector(state => {
    return state.nftMint.stakedTokens;
  });

  const earned = useSelector(state => {
    return state.nftMint.earned;
  });

  const totalSupplyForStaking = useSelector(state => {
    return state.nftMint.totalSupplyForStaking;
  });

  const apr = useSelector(state => {
    return state.nftMint.apr;
  });

  const bnbPrice = useSelector(state => {
    return state.nftMint.bnbPrice;
  });

  let modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  );

  const unStakeAll = async () => {
    await dispatch(
      onUnStakeAll({
        address,
        provider,
        networkID: chainID,
      }),
    );
  };

  const harvest = async () => {
    await dispatch(
      onHarvest({
        address,
        provider,
        networkID: chainID,
      }),
    );
  };

  return (
    <>
      <div id="stake-view">
        <Paper className={`madao-card`}>
          <Grid container columns={{ xs: 4, sm: 8, md: 12 }} style={{ textAlign: "center" }}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h5" color="textSecondary">
                TVL
              </Typography>
              <Typography variant="h4" style={{ color: "#FFAE00" }}>
                {totalSupplyForStaking ? parseInt(totalSupplyForStaking) : 0}MA
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h5" color="textSecondary">
                Earned
              </Typography>
              <Typography variant="h4" style={{ color: "#FFAE00" }}>
                $
                {earned
                  ? trim((earned / 100000000) * marketPrice, 2) + " (" + trim(earned / 100000000, 2) + "MADAO)"
                  : "0"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h5" color="textSecondary">
                APR
              </Typography>
              <Typography variant="h4" style={{ color: "#FFAE00" }}>
                {apr
                  ? trim(((1 + ((apr / 1000000000) * marketPrice * balanceOf) / price / bnbPrice) ** 365 - 1) * 100, 2)
                  : 0}
                %
              </Typography>
            </Grid>
          </Grid>
          {earned && parseInt(earned) !== 0 ? (
            <Box style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              <Button
                variant={btnVarient}
                color="primary"
                style={{ width: "30%" }}
                onClick={() => {
                  harvest();
                }}
              >
                <Typography variant="h6">Harvest</Typography>
              </Button>
            </Box>
          ) : (
            <></>
          )}
        </Paper>
        <Zoom in={true} onEntered={() => setZoomed(true)}>
          <Paper className={`madao-card`}>
            <Grid item>
              <div className="card-header">
                <Typography variant="h5">My NFT</Typography>
              </div>
            </Grid>

            {address ? (
              tokensOfOwner && (tokensOfOwner.length !== 0 || stakedTokens.length !== 0) ? (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={stakedStatus}
                          onChange={() => {
                            handleChange(stakedStatus);
                          }}
                        />
                      }
                      label={statusText}
                    />
                    <Box style={{ display: "flex", justifyContent: "space-between" }}>
                      {stakedStatus ? (
                        <Button
                          variant={btnVarient}
                          color="primary"
                          style={{ width: "30%" }}
                          onClick={() => {
                            unStakeAll();
                          }}
                        >
                          <Typography variant="h6">Unstake All</Typography>
                        </Button>
                      ) : (
                        <>
                          {/* <Button variant={btnVarient} color="primary" style={{ width: "30%" }} onClick={() => {approveAll();}}>
                            <Typography variant="h6">Approve All</Typography>
                          </Button>
                          <Button variant={btnVarient} color="primary" style={{ width: "30%" }}>
                            <Typography variant="h6">Stake All</Typography>
                          </Button> */}
                        </>
                      )}
                    </Box>
                  </div>

                  <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
                    {stakedStatus ? (
                      balanceOf ? (
                        stakedTokens.map(index => {
                          return (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                              <NftCard id={parseInt(index)} staked={true} />
                            </Grid>
                          );
                        })
                      ) : (
                        <></>
                      )
                    ) : (
                      tokensOfOwner.map(index => {
                        return (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <NftCard id={parseInt(index)} staked={false} />
                          </Grid>
                        );
                      })
                    )}
                  </Grid>
                </div>
              ) : (
                <></>
              )
            ) : (
              <div className="stake-wallet-notification">
                <div className="wallet-menu" id="wallet-menu">
                  {modalButton}
                </div>
                <Typography variant="h6">Connect your wallet to stake NFT</Typography>
              </div>
            )}
          </Paper>
        </Zoom>
      </div>
    </>
  );
}

export default NftStake;
