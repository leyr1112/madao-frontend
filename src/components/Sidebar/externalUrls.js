import { ReactComponent as GovIcon } from "../../assets/icons/governance.svg";
import { ReactComponent as DocsIcon } from "../../assets/icons/docs.svg";
import { ReactComponent as PancakeSwapIcon } from "../../assets/icons/pancakeswap.svg";
import { ReactComponent as FeedbackIcon } from "../../assets/icons/feedback.svg";
import { SvgIcon } from "@material-ui/core";
import { AccountBalanceOutlined, MonetizationOnOutlined } from "@material-ui/icons";

const externalUrls = [
  {
    title: "Buy on PancakeSwap",
    url: "https://pancakeswap.finance/swap?inputCurrency=0xe9e7cea3dedca5984780bafc599bd69add087d56&outputCurrency=0x429EE8cc1200bE3aaDBc2641c635ef174a8deE89",
    icon: <SvgIcon viewBox="0 0 96 96" color="primary" component={PancakeSwapIcon} />,
  },
  {
    title: "Docs",
    url: "https://docs.mysticaliens.com/",
    icon: <SvgIcon color="primary" component={DocsIcon} />,
  },
];

export default externalUrls;
