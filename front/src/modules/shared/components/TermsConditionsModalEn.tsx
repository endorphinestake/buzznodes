// ** Hooks Imports
import { useTranslation } from "react-i18next";

// ** Mui Imports
import {
  Button,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { t } from "i18next";

interface IProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  onConfirm: () => void;
}

const TermsConditionsModalEn = (props: IProps) => {
  // ** Props
  const { open, setOpen, onConfirm } = props;

  // ** Hooks
  const { t } = useTranslation();

  const handleClose = () => setOpen(false);

  const handleConfirm = () => onConfirm();

  return (
    <Dialog
      open={open}
      scroll={"paper"}
      onClose={handleClose}
      maxWidth="md"
      fullWidth={true}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle>
        <>
          <IconButton
            color="inherit"
            size="small"
            onClick={handleClose}
            aria-label="close"
            sx={{ position: "absolute", right: 4, top: 4 }}
          >
            <Close />
          </IconButton>
        </>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mt: 4, mb: 4, textAlign: "right" }}>
          Update Date: 01.02.2025
        </Typography>
        <Typography variant="h6">1. Introduction</Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          These terms govern the use of services provided by Endorphine Stake
          ("we", "our", "us"), the team behind
          [buzznodes.com](http://buzznodes.com/).
        </Typography>

        <Typography variant="h6" sx={{ mt: 4 }}>
          2. Our Services
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          We provide a platform for making calls and sending SMS messages
          through third-party providers (e.g., SIP providers). We transmit data
          to these providers solely for enabling communication services.
        </Typography>

        <Typography variant="h6" sx={{ mt: 4 }}>
          3. Your Responsibilities
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          By using our services, you agree to:
          <ul>
            <li>
              Provide accurate information necessary for registration and
              communication;
            </li>
            <li>Use our services in accordance with all applicable laws;</li>
            <li>Not use the services for illegal or malicious activities;</li>
            <li>
              Ensure that the data you provide (including phone numbers) is
              legal.
            </li>
          </ul>
        </Typography>

        <Typography variant="h6" sx={{ mt: 4 }}>
          4. Restrictions on Use
        </Typography>
        <Typography component={"span"} variant="body2" sx={{ mt: 4 }}>
          You agree to:
          <ul>
            <li>Spam or unwanted calls;</li>
            <li>
              Violating privacy laws or causing harm, harassment, or defamation.
            </li>
          </ul>
        </Typography>

        <Typography variant="h6" sx={{ mt: 4 }}>
          5. Privacy and Data Protection
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          We take your privacy seriously. For detailed information on how we
          collect, process, and protect your personal data, please refer to our
          Privacy Policy.
        </Typography>

        <Typography variant="h6" sx={{ mt: 4 }}>
          6. Third-Party Services
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          Our services depend on third-party providers (such as SIP providers)
          to make calls and send SMS messages. We are not responsible for their
          services or how they process data. These providers must comply with
          applicable data protection laws.
        </Typography>

        <Typography variant="h6" sx={{ mt: 4 }}>
          7. Content and Copyrights
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          - Ownership of Content
        </Typography>
        <Typography variant="body2" sx={{ mt: 4, ml: 4 }}>
          All content available through our services is owned by Endorphine
          Stake or our licensors and is protected by intellectual property laws,
          including copyrights and trademarks.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          - License to Use
        </Typography>
        <Typography variant="body2" sx={{ mt: 4, ml: 4 }}>
          We grant you a limited license to access and use our services for
          personal or commercial purposes, in accordance with these terms. You
          may not:
          <ul>
            <li>
              Copy, modify, distribute, or create derivative works of our
              content without permission;
            </li>
            <li>
              Violate the intellectual property rights of Endorphine Stake or
              third parties.
            </li>
          </ul>
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          - User-Provided Content
        </Typography>
        <Typography variant="body2" sx={{ mt: 4, ml: 4 }}>
          If you submit or upload content through our services (e.g., feedback
          or suggestions), you grant us the right to use it to improve our
          services, while retaining ownership of that content.
        </Typography>

        <Typography variant="h6" sx={{ mt: 4 }}>
          8. Limitation of Liability
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          We are not responsible for any indirect or unforeseen damages arising
          from the use of our services, including loss of data or service
          interruptions.
        </Typography>

        <Typography variant="h6" sx={{ mt: 4 }}>
          9. Termination of Access
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          We may suspend or terminate your access to our services without notice
          if you violate these terms or if we believe your use of the services
          is harmful.
        </Typography>

        <Typography variant="h6" sx={{ mt: 4 }}>
          10. Service Availability
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          We do not guarantee the continuous availability of our services and
          may modify or suspend them at any time.
        </Typography>

        <Typography variant="h6" sx={{ mt: 4 }}>
          11. Governing Law and Dispute Resolution
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          These terms are governed by the laws of the country where we operate.
          Any disputes related to these terms or the use of our services must be
          resolved through arbitration.
        </Typography>

        <Typography variant="h6" sx={{ mt: 4 }}>
          12. Changes to Terms
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          These Terms may be updated periodically. We will notify you by
          updating the "Update Date" section.
        </Typography>

        <Typography variant="h6" sx={{ mt: 4 }}>
          13. Contact Us
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          If you have any questions or concerns about these terms, you can
          contact us at contact@endorphinestake.com.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: (theme) => `${theme.spacing(2.5)} !important` }}>
        <Button
          onClick={() => {
            handleClose();
            handleConfirm();
          }}
        >
          {t(`Confirm`)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TermsConditionsModalEn;
