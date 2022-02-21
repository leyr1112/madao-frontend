import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useDispatch, useSelector } from "react-redux";
import { trim, formatCurrency } from "../../helpers";
import { ethers, BigNumber } from "ethers";
import { abi as MaNftABI } from "../../abi/MaNft.json";
import { addresses } from "../../constants";

import "./nftstake.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { onStake, onUnStake, onApprove } from "src/slices/NftMintSlice";

function NftCard({ id, staked }) {
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState("");
  const [imageName, setImageName] = useState("");
  const [isApproved, setIsApproved] = useState("");
  const { provider, address, connected, connect, chainID } = useWeb3Context();
  const btnVarient = false ? "disabled" : "outlined";
  const _baseURI = useSelector(state => {
    return state.nftMint._baseURI;
  });

  const MaNftContract = new ethers.Contract(addresses[chainID].MANFT_ADDRESS, MaNftABI, provider);

  dispatch(async () => {
    const getApproved = await MaNftContract.getApproved(id);
    setIsApproved(getApproved);
  });

  const jsonUrl = _baseURI + id + ".json";

  useEffect(() => {
    fetch(jsonUrl)
      .then(res => res.json())
      .then(
        result => {
          setImageUrl(result.image);
          setImageName(result.name);
        },
        error => {
          console.log("debig fetch uri error", error);
        },
      );
  }, []);

  const stake = async () => {
    await dispatch(
      onStake({
        address,
        value: id.toString(),
        provider,
        networkID: chainID,
      }),
    );
  };

  const unStake = async () => {
    await dispatch(
      onUnStake({
        address,
        value: id.toString(),
        provider,
        networkID: chainID,
      }),
    );
  };

  const approve = async () => {
    await dispatch(
      onApprove({
        address,
        value: id.toString(),
        provider,
        networkID: chainID,
      }),
    );
  };

  return (
    <>
      <Card style={{ padding: "10px", border: "1px solid #FFAE00" }}>
        <CardMedia
          component="img"
          height="160"
          width="200"
          image={"https://gateway.pinata.cloud/" + imageUrl.replace("://", "/")}
          alt={imageName}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" style={{ textAlign: "center" }}>
            {imageName}
          </Typography>
        </CardContent>
        {staked ? (
          <Button
            variant={btnVarient}
            color="primary"
            style={{ width: "100%" }}
            onClick={() => {
              unStake();
            }}
          >
            <Typography variant="h6">Unstake</Typography>
          </Button>
        ) : isApproved ? (
          isApproved.toString() === addresses[chainID].MANFTSTAKING_ADDRESS ? (
            <Button
              variant={btnVarient}
              color="primary"
              style={{ width: "100%" }}
              onClick={() => {
                stake();
              }}
            >
              <Typography variant="h6">Stake</Typography>
            </Button>
          ) : (
            <Button
              variant={btnVarient}
              color="primary"
              style={{ width: "100%" }}
              onClick={() => {
                approve();
              }}
            >
              <Typography variant="h6">Approve</Typography>
            </Button>
          )
        ) : (
          <></>
        )}
      </Card>
    </>
  );
}

export default NftCard;
