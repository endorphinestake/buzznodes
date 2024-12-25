// ** Mui Imports
import {
  Button,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";

interface IProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const TermsConditionsModalEn = (props: IProps) => {
  // ** Props
  const { open, setOpen } = props;

  const handleClose = () => setOpen(false);

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
      <DialogContent dividers={true}>
        <Typography variant="h6">1. Acceptance</Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          These Terms and Conditions of use of buzznodes.com together with our
          privacy policy and all the second additional terms and information
          that may be provided within the framework of the Service (hereinafter
          the "Terms and Conditions") govern your use of the service, website,
          content and software (hereinafter the "Service"). Registering in the
          service using it in full or in part means that you accept these Terms
          and Conditions.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          The Terms and Conditions are an agreement between you and the author,
          the copyright holder buzznodes.com (hereinafter referred to as
          "buzznodes.com"), which defines the rights and obligations in relation
          to the Service from your side and from side buzznodes.com.
        </Typography>

        <Typography variant="h6" sx={{ mt: 4 }}>
          2. Registration and transfer of an action
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          To use the service, you will need to register and create an account
          with an email, and other conditions may apply to it. Before allowing
          the use of the account, buzznodes.com it can check your email address.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          You, and also in the event if you are a minor, your parent or legal
          guardian, are personally responsible for any use of the Service.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          If you no longer want to use the Service, you have the right to cancel
          your registration. After termination of the registration, access to
          the Service will be closed.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          buzznodes.com may terminate or restrict your access to certain parts
          of the Service if buzznodes.com reasonably believes that you have
          violated the Terms and Conditions, or, upon prior notice, if you have
          not used the Service under your access account. If there are any cases
          provided for by politics or independence, buzznodes.com it is not
          responsible for any deletion or loss of information or content
          provided by you to the Service.
        </Typography>

        <Typography variant="h6" sx={{ mt: 4 }}>
          3. Licenses
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          buzznodes.com provides you with an invalid license without the right
          of transfer, which can be revoked at any time at the sole discretion
          of buzznodes.com, to access and use the service in strict accordance
          with the Terms and Conditions. Using the Service does not grant you
          any intellectual property rights in relation to any information or
          content on the Service.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          Some Content can only be accessed by residents of certain geographical
          regions. You must comply with the restrictions imposed on the Content
          you receive through the Service.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          buzznodes.com grants you a limited, non-exclusive, non-compliant
          transfer of the right to install and use software on your computer
          and/or server. You have no right to distribute your token, transfer
          the right to use, modify, translate, reproduce, resell, sublicense,
          lease, reverse engineer or otherwise attempt to obtain the source code
          or create derivatives of the Software.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          You agree to strictly comply with all applicable provisions of the
          legislation governing import and export, and confirm that you are
          responsible for obtaining the licenses necessary for the import,
          re-export, transfer or use of such Software.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          You can provide information and content ("material") to the Service.
          buzznodes.com does not claim ownership of your Material. When you
          transfer material, you don't transfer buzznodes.com ownership of it.
          buzznodes.com only transfers the material and is not required to
          monitor its content.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          You are solely responsible for creating backup ectopia of data that
          you store on the Service, including the Content you upload to the
          Service.
        </Typography>

        <Typography variant="h6" sx={{ mt: 4 }}>
          4. Using The Service
        </Typography>
        <Typography component={"span"} variant="body2" sx={{ mt: 4 }}>
          You agree to:
          <ul>
            <li>observe the current names, Terms and Conditions of conduct;</li>
            <li>use the Service for personal purposes;</li>
            <li>
              not provide any Material that is unlawful, aggressive, inaccurate,
              misleading, offensive, pornographic, threatening, libelous or
              otherwise inappropriate;
            </li>
            <li>
              obtain any consents, permits or licenses that you may be required
              by law to provide the Material;
            </li>
            <li>respect the private lives of other people;</li>
            <li>
              do not distribute or publish spam, "letters of happiness", schemes
              of financial pyramids, viruses;
            </li>
            <li>
              do not use any other technologies or initiate any other actions
              that may harm the Service to the interests or property of Service
              users;
            </li>
            <li>
              be responsible for the consequences associated with the placement
              of Material;
            </li>
            <li>do not report or distribute your name to third parties.</li>
          </ul>
          buzznodes.com can, but doesn't have to:
          <ul>
            <li>monitor or moderate any Content or Material;</li>
            <li>delete any Material from the Service;</li>
            <li>
              restrict access to any part of the Service at any time at your own
              discretion.
            </li>
          </ul>
        </Typography>

        <Typography variant="h6" sx={{ mt: 4 }}>
          5. Content
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          buzznodes.com is not responsible for any claims or insults arising
          from or caused to you as a result of accessing the Content on the
          Service.
        </Typography>
        <Typography component={"span"} variant="body2" sx={{ mt: 4 }}>
          You agree to:
          <ul>
            <li>use the Content for personal purposes only;</li>
            <li>
              not to copy, to give, to sell, to resell, to borrow, to rent, to
              offer, to broadcast, to send, to distribute, to transmit, to make
              public, to reproduce, to modify, to demonstrate, to perform, to
              use for commercial purposes and not to provide access to the
              Content, unless otherwise permitted in the applicable Terms and
              Conditions, with notice of buzznodes.com about any and all unused
              use;
            </li>
            <li>
              do not delete, get round, reverse engineer, do not decrypt or
              otherwise modify and interfere with any applicable rules of use
              and do not attempt to circumvent the functions of digital rights
              management and protection from copying related to Content or any
              other technologies used to control access to Content or use of
              Content or its identifying information;
            </li>
            <li>
              do not use any automated systems and tools, except those provided
              by us, to select or download Content;
            </li>
            <li>
              do not disclose your token or otherwise allow other persons to
              access their Content. Restrictions on copying applied to the
              respective means also apply to the Content that has been accessed
              from part of the Service.
            </li>
          </ul>
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          The third party Content provider is solely responsible for any posted
          Content, including any warranties not covered by a disclaimer, or any
          claims you may have in relation to the Content or its use.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          Providing you with content, buzznodes.com can act as an agent-provider
          of third-party Content. buzznodes.com it is not a party to the
          agreement between you and the provider of third-party Content in
          relation to its Content.
        </Typography>

        <Typography variant="h6" sx={{ mt: 4 }}>
          6. Claims of copyright infringemen
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          buzznodes.com considers rights of intellectual property belonging to
          third parties. To report non-compliance with intellectual property
          rights, including copyright infringement, use the procedure for
          sending a notice of infringement via email to support@buzznodes.com.
          We will not respond to requests that were submitted from an address
          that is not registered in the Service.
        </Typography>

        <Typography variant="h6" sx={{ mt: 4 }}>
          7. Notifications
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          buzznodes.com can place notifications on the Service.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          buzznodes.com can also send you notifications about any changes and
          Services via email or The Telegram ID provided by you.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          You will be deemed to have received such notification no later than
          seven (7) days after buzznodes.com sent or posted such notification.
          Your continued use of the Service means that you have received all
          notifications regardless of the search method.
        </Typography>

        <Typography variant="h6" sx={{ mt: 4 }}>
          8. Payments
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          Your use of the service may be paid or may become paid if the initial
          trial version is valid. Any payments made by buzznodes.com in
          connection with the Service will be announced additionally.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          The prices placed on the Service do not include fees or commissions
          from your payment service provider.
        </Typography>

        <Typography variant="h6" sx={{ mt: 4 }}>
          9. Order and payment terms
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          "Order" means the choice of a signature for the Content and Services
          offered by buzznodes.com and available on the Service, providing
          information about the selected method of payment, as well as placing
          an order by clicking the "Buy", "OK" or "I accept" buttons, or other
          similar confirmation of acceptance of the conditions in the process of
          making an order, or other indication of acceptance of the conditions
          that presented to you during the ordering process.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          To post an Order on the Service, you must have reached the age of
          legal capacity in accordance with applicable law. If you have not yet
          reached the age of legal capacity or the age of majority, you can only
          place Orders with the prior consent of the remaining parent or
          guardian.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          You agree that all Orders are legally binding. All Orders are made
          subject to their acceptance of buzznodes.com. You can pay by credit or
          debit card, using the TRC20 protocol, or choose another payment
          method, if available.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          You agree to pay the fees and charges of your payment service provider
          associated with your Order, to ensure that the payment instrument is
          valid at the time you place the Order, and you warrant that you are
          the legal owner of the instrument and that it is used within the
          Credit Limit.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          You agree to use such Content only in the manner permitted by these
          Terms and Conditions and any additional terms that may be presented to
          you during your order placement.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          You allow the Service to periodically charge for the subscription
          period. The Service may also offer a trial period. If your Order
          includes a trial period (also called “Trial”), you may be charged
          after the trial period expires, unless you cancel the product in
          accordance with the terms of your signature / trial period.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          Prices on the service may change from time to time. Prices include
          applicable taxes in effect at the time of payment, unless otherwise
          specified. There may be cases when you will incur additional costs due
          to the currency exchange rate used and/or additional fees charged by
          your bank or credit card issuer. buzznodes.com does not bear any
          responsibility for the payment of such commissions or fees to the bank
          or any other third party.
        </Typography>

        <Typography variant="h6" sx={{ mt: 4 }}>
          10. Cancellation and refund
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          You agree to online transmission of Content that starts after placing
          an Order. You won't be able to cancel the Order after it's processed.
          Due to its special features, the Content cannot be returned.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          If, after placing the Order, you discover and immediately inform
          buzznodes.com within 48 hours that (a) the Content you have ordered
          contains defects; (b) the Content delivered to you by buzznodes.com
          does not match the description of the Content that you ordered through
          the Service, or (c) the delivery of your Content was delayed or did
          not occur as a result of technical problems, or as a result of
          technical problems, several accidental orders were made, the only and
          your sole remedy for such Content is, at buzznodes.com's sole
          discretion, replacement or refund of that Content. In other cases,
          refund is not possible.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          Please note that buzznodes.com customer support may not be able to
          process your request if you are unable to indicate the unique token of
          the deal after placing the Order on the Service.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          buzznodes.com may only make a refund for Content if the total cost
          exceeds the monetary limit provided by applicable local laws.
        </Typography>

        <Typography variant="h6" sx={{ mt: 4 }}>
          11. Feedback addressed to buzznodes.com
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          By submitting any ideas, feedback and/or suggestions ("Feedback") to
          buzznodes.com through the Service or otherwise, you acknowledge and
          agree that: (1) buzznodes.com may have development ideas similar to
          the Feedback; (2) your Feedback does not contain any confidential
          information or information belonging to you or any third party; (3)
          buzznodes.com does not undertake any obligation to comply with the
          confidentiality of the Feedback; (4) buzznodes.com can freely use,
          distribute, apply and further develop or modify the Feedback for any
          purpose; (5) you are not entitled to any compensation of any nature
          from buzznodes.com.
        </Typography>

        <Typography variant="h6" sx={{ mt: 4 }}>
          12. Availability and technical requirement
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          The availability of the Content and Service may change and is
          determined at the best discretion of buzznodes.com. buzznodes.com
          expressly disclaims any representations or warranties regarding the
          availability of any particular Content or Service. The availability of
          the Service depends on the region, the Service can only be provided in
          certain languages. The service, operations and other functions may
          also: depend on the network, the compatibility of the devices used, as
          well as the supported content formats.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          buzznodes.com can, acting at your own discretion, completely or
          partially change, fix or close down the service. During service breaks
          and in other cases, the Service may not be available.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          To guarantee the availability of the latest version of software and
          applications on your device, your device can check the availability of
          software updates from buzznodes.com. If they are detected, you will be
          notified by the Service.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          In case buzznodes.com considers the software update important or
          critical, you may not continue to use the previous version of the
          Software. buzznodes.com may prevent the use of a previous version of
          the Software or Service prior to installing the update.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          buzznodes.com may block any Content or Software associated with your
          account on the Service, for any reason, and remove any Content or
          Software, and/or block copies of any application on your device in
          order to protect the Service, the applications of the providers
          through which networks you receive access to the Service, or any other
          affected or potentially affected parties.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          A specific service may be a preliminary version, such as a BETA
          version, and therefore its operation may differ from that of the final
          version. buzznodes.com can significantly change any version of the
          Service or Software or decide not to release the final version.
        </Typography>

        <Typography variant="h6" sx={{ mt: 4 }}>
          13. Links to sites and content of third parties
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          buzznodes.com may include access to sites and services on the Internet
          or preinstalled client applications that allow interacting with sites
          and services that are owned or controlled by third parties and are not
          part of the Service.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          You must read and agree to the terms of use and its sites or services
          before you start using other sites or services. buzznodes.com does not
          control the content, sites or services of third parties and does not
          bear any responsibility for the services provided on these sites or
          services of third parties, or the materials created or published on
          them. A link to a third-party website does not mean that buzznodes.com
          approves this site or mentions products or services on it.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          In addition, you and other users can create content on the service or
          link to content that was not otherwise placed on the service.
          buzznodes.com is not responsible for content or links of this type.
        </Typography>

        <Typography variant="h6" sx={{ mt: 4 }}>
          14. Limitation of liability
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          The service is provided on an "AS IS" and "AS AVAILABLE" basis.
          buzznodes.com does not guarantee that the Service will work
          continuously and will not contain errors or viruses. No warranty of
          any kind, express or implied, is provided with respect to the
          availability, accuracy, reliability, information or content of the
          Service, including, but not limited to, guarantees of ownership,
          non-infringement or merchantability or fitness for a purpose. You
          expressly agree and confirm that you use the Service solely on your
          own account and that you may be provided with content from various
          sources.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          On the exclusion of responsibility for death or physical harm injuries
          caused by gross negligence or deliberate illegal actions, or in any
          other circumstances buzznodes.com will not be liable for any indirect,
          accidental, punitive or subsequent damages caused by the use or
          inability to use the Service.
        </Typography>

        <Typography variant="h6" sx={{ mt: 4 }}>
          15. Refund
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          You agree to release buzznodes.com from liability and indemnify them
          in connection with any claims from third parties and any liability,
          compensation, loss, expense or damage arising from or in connection
          with (i) your violation of the Terms and Conditions, (ii) your
          violation or non-compliance with any rights intellectual property,
          other rights or privacy rights of third parties; or (iii) unauthorized
          use of the Service by third parties, if such unauthorized use was made
          possible as a result of your failure to take reasonable steps to
          protect your username and password from abuse.
        </Typography>

        <Typography variant="h6" sx={{ mt: 4 }}>
          16. Intellectual property
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          The Service, Content and Software are protected in accordance with
          international copyright rights. buzznodes.com declares the copyright
          to the Service, Content and Software to the maximum permissible
          degree. In accordance with conditions buzznodes.com retains all
          rights, property rights and other rights to the Service, Content,
          Software and all other products, software and other property
          buzznodes.com provided to you by the used Service.
        </Typography>

        <Typography variant="h6" sx={{ mt: 4 }}>
          17. Cession
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          buzznodes.com may assign its rights and obligations under these Terms
          and Conditions to its parent or one of its subsidiaries or to any
          company under common control with buzznodes.com. In addition,
          buzznodes.com may assign its rights and obligations under these terms
          to a third party in connection with the merger, absorption, sale of
          assets, by act of law or for other reasons.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: (theme) => `${theme.spacing(2.5)} !important` }}>
        <Button onClick={handleClose}>OK</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TermsConditionsModalEn;
