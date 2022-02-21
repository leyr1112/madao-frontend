import MadaoIcon from "../../assets/icons/madao-nav-header.svg";
import "./notfound.scss";

export default function NotFound() {
  return (
    <div id="not-found">
      <div className="not-found-header">
        <a href="https://app.mysticaliens.com/" target="_blank">
          <img className="branding-header-icon" src={MadaoIcon} alt="MysticAliensDao" />
        </a>

        <h2 style={{ textAlign: "center" }}>Page not found</h2>
      </div>
    </div>
  );
}
