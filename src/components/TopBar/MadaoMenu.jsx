import { useState, useEffect } from "react";
import { addresses, TOKEN_DECIMALS } from "../../constants";
import { Link, SvgIcon, Popper, Button, Paper, Typography, Divider, Box, Fade, Slide } from "@material-ui/core";
import { ReactComponent as InfoIcon } from "../../assets/icons/info-fill.svg";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up.svg";
import { ReactComponent as smadaoTokenImg } from "../../assets/tokens/SMADAO.svg";
import { ReactComponent as madaoTokenImg } from "../../assets/tokens/MADAO.svg";

import "./madaomenu.scss";
import { busd } from "src/helpers/AllBonds";
import { useWeb3Context } from "../../hooks/web3Context";

import MadaoImg from "src/assets/tokens/MADAO.svg";
import SMadaoImg from "src/assets/tokens/SMADAO.svg";

const addTokenToWallet = (tokenSymbol, tokenAddress) => async () => {
  if (window.ethereum) {
    const host = window.location.origin;
    // NOTE (appleseed): 33T token defaults to sMADAO logo since we don't have a 33T logo yet
    let tokenPath;
    // if (tokenSymbol === "MADAO") {

    // } ? MadaoImg : SMadaoImg;
    switch (tokenSymbol) {
      case "MADAO":
        tokenPath = MadaoImg;
        break;
      default:
        tokenPath = SMadaoImg;
    }
    const imageURL = `${host}/${tokenPath}`;

    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: TOKEN_DECIMALS,
            image: imageURL,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
};

function MadaoMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const isEthereumAPIAvailable = window.ethereum;
  const { chainID } = useWeb3Context();

  const networkID = chainID;

  const SMADAO_ADDRESS = addresses[networkID].SMADAO_ADDRESS;
  const MADAO_ADDRESS = addresses[networkID].MADAO_ADDRESS;
  const USDC_ADDRESS = addresses[networkID].USDC_ADDRESS;

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = "madao-popper";
  const busdAddress = busd.getAddressForReserve(networkID);
  return (
    <Box
      component="div"
      onMouseEnter={e => handleClick(e)}
      onMouseLeave={e => handleClick(e)}
      id="madao-menu-button-hover"
    >
      <Button id="madao-menu-button" size="large" variant="contained" color="secondary" title="MADAO" aria-describedby={id}>
        <SvgIcon component={InfoIcon} color="primary" />
        <Typography>MADAO</Typography>
      </Button>

      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start" transition>
        {({ TransitionProps }) => {
          return (
            <Fade {...TransitionProps} timeout={100}>
              <Paper className="madao-menu" elevation={1}>
                <Box component="div" className="buy-tokens">
                  <Link
                    href={`https://pancakeswap.finance/swap?inputCurrency=${busdAddress}&outputCurrency=${MADAO_ADDRESS}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="large" variant="contained" color="secondary" fullWidth>
                      <Typography align="left">
                        Buy on PancakeSwap <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                      </Typography>
                    </Button>
                  </Link>
                </Box>

                {isEthereumAPIAvailable ? (
                  <Box className="add-tokens">
                    <Divider color="secondary" />
                    <p>ADD TOKEN TO WALLET</p>
                    <Box display="flex" flexDirection="row" justifyContent="space-between">
                      <Button variant="contained" color="secondary" onClick={addTokenToWallet("MADAO", MADAO_ADDRESS)}>
                        <SvgIcon
                          component={madaoTokenImg}
                          viewBox="0 0 32 32"
                          style={{ height: "25px", width: "25px" }}
                        />
                        <Typography variant="body1">MADAO</Typography>
                      </Button>
                      <Button variant="contained" color="secondary" onClick={addTokenToWallet("sMADAO", SMADAO_ADDRESS)}>
                        <SvgIcon
                          component={smadaoTokenImg}
                          viewBox="0 0 100 100"
                          style={{ height: "25px", width: "25px" }}
                        />
                        <Typography variant="body1">sMADAO</Typography>
                      </Button>
                    </Box>
                  </Box>
                ) : null}
              </Paper>
            </Fade>
          );
        }}
      </Popper>
    </Box>
  );
}

export default MadaoMenu;
