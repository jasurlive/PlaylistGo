import * as Popover from "@radix-ui/react-popover";
import { motion } from "framer-motion";
import {
  FaUserAstronaut,
  FaGithub,
  FaTelegram,
  FaWhatsapp,
  FaLinkedinIn,
} from "react-icons/fa";
import { TbSquareRoundedLetterJFilled } from "react-icons/tb";
import { SiChessdotcom } from "react-icons/si";
import { MdHeadset } from "react-icons/md";
import "../../css/social.css";

const socialLinks = [
  {
    href: "https://jasurlive.uz",
    icon: TbSquareRoundedLetterJFilled,
    customClass: "social-icon",
  },
  {
    href: "https://github.com/jasurlive",
    icon: FaGithub,
    className: "social-icon",
  },
  {
    href: "https://t.me/jasurjacob_bot",
    icon: FaTelegram,
    className: "social-icon",
  },
  {
    href: "https://wa.me/+447775180677",
    icon: FaWhatsapp,
    className: "social-icon",
  },
];

const SocialMenu: React.FC = () => {
  return (
    <motion.div
      className="social-menu"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      transition={{ type: "spring", mass: 0.75, duration: 0.7 }}
    >
      {socialLinks.map(
        ({ href, icon: Icon, customClass, className }, index) => (
          <a key={index} href={href} className={customClass || className}>
            {Icon ? <Icon /> : <div className="ielts-text">IELTS</div>}
          </a>
        )
      )}
    </motion.div>
  );
};

const Social: React.FC = () => {
  return (
    <div className="social-container">
      <Popover.Root>
        <Popover.Trigger asChild>
          <button className="social-button">
            <FaUserAstronaut />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content>
            <SocialMenu />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};

export default Social;
