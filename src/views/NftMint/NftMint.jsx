import { useEffect, useState } from "react";
import {
  Paper,
  Grid,
  Typography,
  Box,
  Zoom,
  Container,
  useMediaQuery,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@material-ui/core";
import TabPanel from "../../components/TabPanel";
import { Skeleton } from "@material-ui/lab";
import { useDispatch, useSelector } from "react-redux";
import { trim, formatCurrency } from "../../helpers";
import { error } from "../../slices/MessagesSlice";
import { ethers, BigNumber } from "ethers";

import "./nftmint.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { changeMintNft } from "src/slices/NftMintSlice";
import { quartersToYears } from "date-fns";

function NftMint() {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();
  const isAppLoading = useSelector(state => state.nftMint.loading);

  const [zoomed, setZoomed] = useState(false);
  const [quantity, setQuantity] = useState("");

  const smallerScreen = useMediaQuery("(max-width: 650px)");
  const verySmallScreen = useMediaQuery("(max-width: 379px)");

  const price = useSelector(state => {
    return state.nftMint.price;
  });

  const totalSupply = useSelector(state => {
    return state.nftMint.totalSupply;
  });

  const maxSupply = useSelector(state => {
    return state.nftMint.maxSupply;
  });

  const maxPerTx = useSelector(state => {
    return state.nftMint.maxPerTx;
  });
  const nftBalance = useSelector(state => {
    return state.account.balances && state.account.balances.manft;
  });

  const bnbBalance = useSelector(state => {
    return state.account.balances && state.account.balances.bnb;
  });

  const isPaused = useSelector(state => {
    return state.nftMint.isPaused;
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  let modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  );

  const setMax = () => {
    setQuantity(maxPerTx);
  };

  const onChangeMintNft = async () => {
    // eslint-disable-next-line no-restricted-globals
    let value;
    value = parseInt(quantity);
    setQuantity(parseInt(value));
    if (!maxPerTx) {
      return dispatch(error("Network Error"));
    }
    if (value > maxPerTx ) {
      return dispatch(error("You can't buy maximum amount per transaction."));
    }
    if(value > 10 - parseInt(nftBalance)){
      return dispatch(error("You can own up to 10."))
    }
    const amount = value;
    value = value * price;
    if (isNaN(value) || value === 0 || value === "") {
      // eslint-disable-next-line no-alert
      return dispatch(error("Please enter a value!"));
    }

    // 1st catch if quantity > balance
    let gweiValue = ethers.utils.parseUnits(value.toString(), "ether");
    if (gweiValue.gt(ethers.utils.parseUnits(bnbBalance, "ether"))) {
      return dispatch(error("You have no enough BNB balance."));
    }

    if (isPaused) {
      return dispatch(error("Sale is not active"));
    }

    await dispatch(
      changeMintNft({
        address,
        value: amount.toString(),
        provider,
        networkID: chainID,
        callback: () => setQuantity(""),
      }),
    );
  };

  return (
    <>
      <div id="nftmint-view">
        <Zoom in={true} onEntered={() => setZoomed(true)}>
          <Paper className={`madao-card`}>
            <Grid item>
              <div className="card-header">
                <Typography variant="h5">NFT Mint</Typography>
              </div>
            </Grid>
            <Grid container columns={{ xs: 4, sm: 8, md: 12 }} style={{ textAlign: "center" }}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="h5" color="textSecondary">
                  Current Supply (total)
                </Typography>
                <Typography variant="h4" style={{color: "#FFAE00"}}>
                  {maxSupply && totalSupply ? (
                    parseInt(totalSupply) + " / " + parseInt(maxSupply)
                  ) : (
                    <Skeleton type="text" />
                  )}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="h5" color="textSecondary">
                  NFT Price
                </Typography>
                <Typography variant="h4" style={{color: "#FFAE00"}}>
                  {price ? price + "BNB" : <Skeleton type="text" />}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="h5" color="textSecondary">
                  Max Amount Per Tx
                </Typography>
                <Typography variant="h4" style={{color: "#FFAE00"}}>
                  {maxPerTx ? trim(maxPerTx, 0) : <Skeleton type="text" />}
                </Typography>
              </Grid>
            </Grid>
            <div className="staking-area">
              {!address ? (
                <div className="nftmint-wallet-notification">
                  <div className="wallet-menu" id="wallet-menu">
                    {modalButton}
                  </div>
                  <Typography variant="h6">Connect your wallet to mint NFT</Typography>
                </div>
              ) : (
                <>
                  <Box className="nftmint-action-row" display="flex" alignItems="center">
                    <FormControl className="madao-input" variant="outlined" color="primary">
                      <InputLabel htmlFor="amount-input"></InputLabel>
                      <OutlinedInput
                        id="amount-input"
                        type="number"
                        placeholder="Enter an amount(Integer)"
                        className="nftmint-input"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        labelWidth={0}
                        endAdornment={
                          <InputAdornment position="end">
                            <Button variant="text" onClick={setMax} color="inherit">
                              Max
                            </Button>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                    <TabPanel className="nftmint-tab-panel">
                      <Button
                        className="nftmint-button"
                        variant="contained"
                        color="primary"
                        disabled={isPendingTxn(pendingTransactions, "nftMinting")}
                        onClick={() => {
                          onChangeMintNft(false);
                        }}
                      >
                        {txnButtonText(pendingTransactions, "nftMinting", "Mint")}
                      </Button>
                    </TabPanel>
                  </Box>
                </>
              )}
            </div>

            <div className={`nftmint-user-data`}>
              <div className="data-row">
                <Typography variant="body1">Your BNB Balance</Typography>
                <Typography variant="body1">
                  {isAppLoading ? <Skeleton width="80px" /> : <>{trim(bnbBalance, 4)} BNB</>}
                </Typography>
              </div>

              <div className="data-row">
                <Typography variant="body1">Your NFT Balance</Typography>
                <Typography variant="body1">
                  {isAppLoading ? <Skeleton width="80px" /> : <>{trim(nftBalance, 4)} MA</>}
                </Typography>
              </div>
            </div>
          </Paper>
        </Zoom>
      </div>
    </>
  );
}

export default NftMint;
