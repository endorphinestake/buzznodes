// ** React Imports
import { memo, useState, useEffect, Fragment } from 'react';

// ** Hooks Imports
import { useUserService } from '@hooks/useUserService';
import { useTranslation } from 'react-i18next';

// ** Yup Imports
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

// ** Types Imports
import { TApiKey } from '@modules/users/types';

// ** Shared Components Imports
import Notify from '@modules/shared/utils/Notify';
import ConfirmDialog from '@modules/shared/components/ConfirmDialog';
import DialogComponent from '@modules/shared/components/Dialog';

// ** Mui Imports
import {
  TextField,
  FormControl,
  Box,
  styled,
  Switch,
  FormHelperText,
  IconButton,
  Divider,
  Tooltip,
  Alert,
  AlertTitle,
  Chip,
  Button,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import MuiFormControlLabel, {
  FormControlLabelProps,
} from '@mui/material/FormControlLabel';
import { DeleteOutline, Close } from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';


const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(
  ({ theme }) => ({
    marginBottom: theme.spacing(4),
    '& .MuiFormControlLabel-label': {
      fontSize: '0.875rem',
      color: theme.palette.text.secondary,
    },
  })
);

const schema = yup.object().shape({
  ip_allowed: yup.string().nullable(),
  is_can_send_sms: yup.boolean(),
  is_can_sms_out: yup.boolean(),
  is_can_gateways: yup.boolean(),
  is_can_gateway_logs: yup.boolean(),
  is_can_send_dlr: yup.boolean(),
  is_can_sms_in: yup.boolean(),
  is_can_clients: yup.boolean(),
  is_can_client_logs: yup.boolean(),
});

interface IFormValues {
  is_can_send_sms: boolean;
  is_can_sms_out: boolean;
  is_can_gateways: boolean;
  is_can_gateway_logs: boolean;
  is_can_send_dlr: boolean;
  is_can_sms_in: boolean;
  is_can_clients: boolean;
  is_can_client_logs: boolean;
  ip_allowed: string;
}

interface IProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  apiKeyObj?: TApiKey;
}

const EditApiKeyDialog = (props: IProps) => {
  // ** Props
  const { open, setOpen, apiKeyObj } = props;

  // ** State
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [apiKeyString, setApiKeyString] = useState<string>('');

  // ** Hooks
  const { t } = useTranslation();
  const {
    dispatch,
    apiKeyCreate,
    apiKeyUpdate,
    apiKeyDelete,
    apiKeyList,
    apiKey,

    isApiKeyCreateLoading,
    isApiKeyCreateLoaded,
    isApiKeyCreateError,
    isApiKeyUpdateLoading,
    isApiKeyUpdateLoaded,
    isApiKeyUpdateError,
    // isApiKeyDeleteLoading,
    isApiKeyDeleteLoaded,
    isApiKeyDeleteError,

    resetApiKeyCreateState,
    resetApiKeyUpdateState,
    resetApiKeyDeleteState,
  } = useUserService();

  const initDefaultValues = () => {
    return {
      ip_allowed: apiKeyObj?.ip_allowed,
      is_can_send_sms: apiKeyObj ? apiKeyObj.is_can_send_sms : true,
      is_can_sms_out: apiKeyObj? apiKeyObj.is_can_sms_out : true,
      is_can_gateways: apiKeyObj? apiKeyObj.is_can_gateways : true,
      is_can_gateway_logs: apiKeyObj? apiKeyObj.is_can_gateway_logs : true,
      is_can_send_dlr: apiKeyObj? apiKeyObj.is_can_send_dlr : true,
      is_can_sms_in: apiKeyObj? apiKeyObj.is_can_sms_in : true,
      is_can_clients: apiKeyObj? apiKeyObj.is_can_clients : true,
      is_can_client_logs: apiKeyObj? apiKeyObj.is_can_client_logs : true,
    };
  };

  const {
    control,
    reset,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormValues>({
    defaultValues: {},
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: IFormValues) => {
    if (apiKeyObj) {
      // Update apiKey
      dispatch(apiKeyUpdate({...{id: apiKeyObj.id}, ...data}));
    } else {
      // Create apiKey
      dispatch(apiKeyCreate(data));
    }
  };

  const handleClose = () => setOpen(false);

  const handleConfirmDelete = () => dispatch(apiKeyDelete(apiKeyObj!.id));

  const handleClickDelete = () => setOpenDelete(true);

  // Event on Modal open/close
  useEffect(() => {
    reset(initDefaultValues());
  }, [open]);

  // Events on UserService.createApiKey
  useEffect(() => {
    // isError
    if(isApiKeyCreateError) {
      dispatch(resetApiKeyCreateState());

      if(isApiKeyCreateError?.response?.data?.message){
        Notify('error', isApiKeyCreateError.response.data.message);
      } else {
        Object.entries(isApiKeyCreateError.response.data).forEach(
          ([key, value]) => {
            type keys = keyof IFormValues;
            setError(key as keys, {
              type: 'manual',
              message: value as string,
            });
          }
        );
      }
    }

    // isSuccess
    if (isApiKeyCreateLoaded) {
      // Notify('success', 'The API key successfully created!');
      dispatch(resetApiKeyCreateState());
      dispatch(apiKeyList());
      setApiKeyString(apiKey || '');
    }
  }, [dispatch, isApiKeyCreateError, isApiKeyCreateLoaded, apiKey]);

  // Events on Updated apiKeyObj
  useEffect(() => {
    // isError
    if(isApiKeyUpdateError) {
      dispatch(resetApiKeyUpdateState());

      if(isApiKeyUpdateError?.response?.data?.message){
        Notify('error', isApiKeyUpdateError.response.data.message);
      } else {
        Object.entries(isApiKeyUpdateError.response.data).forEach(
          ([key, value]) => {
            type keys = keyof IFormValues;
            setError(key as keys, {
              type: 'manual',
              message: value as string,
            });
          }
        );
      }
    }

    // isSuccess
    if (isApiKeyUpdateLoaded) {
      Notify('success', t(`The API key successfully changed!`));
      dispatch(resetApiKeyUpdateState());
      dispatch(apiKeyList());
      handleClose();
    }
  }, [dispatch, isApiKeyUpdateError, isApiKeyUpdateLoaded]);

  // Events on UserService.apiKeyDelete
  useEffect(() => {
    // isSuccess
    if (isApiKeyDeleteLoaded) {
      Notify('success', t(`The API key successfully deleted!`));
      dispatch(resetApiKeyDeleteState());
      dispatch(apiKeyList());
      handleClose();
    }

    // Can't delete api-key
    if (isApiKeyDeleteError) {
      Notify('error', t(`Can't delete the API key!`));
      dispatch(resetApiKeyDeleteState());
    }
  }, [dispatch, isApiKeyDeleteLoaded, isApiKeyDeleteError]);

  return (
    <Fragment>
      <DialogComponent open={open} handleClose={() => {
        setApiKeyString('')
        setOpen(!open)
      }} setOpen={setOpen} title={apiKeyObj ? t(`Edit API key`) : t(`Create API key`)} maxWidth='sm' content={
        apiKeyString ? 
        <>
          <Alert severity='success'>
            <AlertTitle>{t(`Success`)}</AlertTitle>
            {t(`Your key has been successfully created! Your key is available for copying only once, copy and save it right now!`)}
          </Alert>

          <Alert severity='warning' sx={{mt: 4}}>
            <AlertTitle>{t(`Warning`)}</AlertTitle>
            {t(`Do not disclose your API Key to anyone. You should treat your API Key like your passwords.
  It is recommended to restrict access to trusted IPs only to increase your account security.`)}
          </Alert>

          <Box sx={{mt: 8}}>
            <Chip label={apiKeyString} />
          </Box>

          <Button variant='outlined' sx={{ mt: 8 }} onClick={() => {
            navigator.clipboard.writeText(apiKeyString);
            Notify('success', t(`Copied to clibboard`));
          }}>
            {t(`Copy`)}
          </Button>
        </>
        :
        
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>

          {/* ip_allowed */}
          <FormControl fullWidth sx={{ mb: 6, mt: 2 }}>
            <Controller
              name='ip_allowed'
              control={control}
              rules={{ required: false }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label={t(`IP Whitelist`)}
                  onChange={onChange}
                  error={Boolean(errors.ip_allowed)}
                  helperText={t(`IP whitelist separated by comma`)}
                  placeholder='11.22.33.44, 55.66.77.88'
                />
              )}
            />
            {errors.ip_allowed && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.ip_allowed.message}
              </FormHelperText>
            )}
          </FormControl>

          <Typography variant='subtitle1'>{t(`SMPP-Client permissions`)}:</Typography>

          {/* is_can_send_sms */}
          <FormControl fullWidth>
            <Controller
              name='is_can_send_sms'
              control={control}
              rules={{ required: false }}
              render={({ field: { value, onBlur, onChange } }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={value}
                      onChange={onChange}
                      color='success'
                    />
                  }
                  label={<span>
                    {t(`Can Send SMS`)}
                    <Tooltip title={t(`It can send SMS to any connected SMSC`)}>
                      <InfoIcon fontSize="small" color="info" sx={{ ml: 1 }} />
                    </Tooltip>
                  </span>}
                />
              )}
            />
            {errors.is_can_send_sms && (
              <FormHelperText sx={{ color: 'error.main', mb: 2 }}>
                {errors.is_can_send_sms.message}
              </FormHelperText>
            )}
          </FormControl>

          {/* is_can_sms_out */}
          <FormControl fullWidth>
            <Controller
              name='is_can_sms_out'
              control={control}
              rules={{ required: false }}
              render={({ field: { value, onBlur, onChange } }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={value}
                      onChange={onChange}
                      color='success'
                    />
                  }
                  label={<span>
                    {t(`Can Fetch SMS Out`)}
                    <Tooltip title={t(`It can retrieve all sent SMS messages for all SMSCs`)}>
                      <InfoIcon fontSize="small" color="info" sx={{ ml: 1 }} />
                    </Tooltip>
                    </span>}
                />
              )}
            />
            {errors.is_can_sms_out && (
              <FormHelperText sx={{ color: 'error.main', mb: 2 }}>
                {errors.is_can_sms_out.message}
              </FormHelperText>
            )}
          </FormControl>

          {/* is_can_gateways */}
          <FormControl fullWidth>
            <Controller
              name='is_can_gateways'
              control={control}
              rules={{ required: false }}
              render={({ field: { value, onBlur, onChange } }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={value}
                      onChange={onChange}
                      color='success'
                    />
                  }
                  label={<span>
                    {t(`Can Manage SMSC`)}
                    <Tooltip title={t(`It can manage any SMSCs`)}>
                      <InfoIcon fontSize="small" color="info" sx={{ ml: 1 }} />
                    </Tooltip>
                    </span>}
                />
              )}
            />
            {errors.is_can_gateways && (
              <FormHelperText sx={{ color: 'error.main', mb: 2 }}>
                {errors.is_can_gateways.message}
              </FormHelperText>
            )}
          </FormControl>

          {/* is_can_gateway_logs */}
          <FormControl fullWidth>
            <Controller
              name='is_can_gateway_logs'
              control={control}
              rules={{ required: false }}
              render={({ field: { value, onBlur, onChange } }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={value}
                      onChange={onChange}
                      color='success'
                    />
                  }
                  label={<span>
                    {t(`Can Fetch SMSC-Logs`)}
                    <Tooltip title={t(`It can retrieve/download SMPP-logs from any SMSCs`)}>
                      <InfoIcon fontSize="small" color="info" sx={{ ml: 1 }} />
                    </Tooltip>
                    </span>}
                />
              )}
            />
            {errors.is_can_gateway_logs && (
              <FormHelperText sx={{ color: 'error.main', mb: 2 }}>
                {errors.is_can_gateway_logs.message}
              </FormHelperText>
            )}
          </FormControl>

          <Typography variant='subtitle1'>{t(`SMPP-Server permissions`)}:</Typography>

          {/* is_can_send_dlr */}
          <FormControl fullWidth>
            <Controller
              name='is_can_send_dlr'
              control={control}
              rules={{ required: false }}
              render={({ field: { value, onBlur, onChange } }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={value}
                      onChange={onChange}
                      color='success'
                    />
                  }
                  label={<span>
                    {t(`Can Send DLR`)}
                    <Tooltip title={t(`It can send Delivery Reports (DLR) to connected ESMEs`)}>
                      <InfoIcon fontSize="small" color="info" sx={{ ml: 1 }} />
                    </Tooltip>
                    </span>}
                />
              )}
            />
            {errors.is_can_send_dlr && (
              <FormHelperText sx={{ color: 'error.main', mb: 2 }}>
                {errors.is_can_send_dlr.message}
              </FormHelperText>
            )}
          </FormControl>

          {/* is_can_sms_in */}
          <FormControl fullWidth>
            <Controller
              name='is_can_sms_in'
              control={control}
              rules={{ required: false }}
              render={({ field: { value, onBlur, onChange } }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={value}
                      onChange={onChange}
                      color='success'
                    />
                  }
                  label={<span>
                    {t(`Can Fetch SMS In`)}
                    <Tooltip title={t(`It can retrieve all incoming SMS messages for any ESMEs`)}>
                      <InfoIcon fontSize="small" color="info" sx={{ ml: 1 }} />
                    </Tooltip>
                    </span>}
                />
              )}
            />
            {errors.is_can_sms_in && (
              <FormHelperText sx={{ color: 'error.main', mb: 2 }}>
                {errors.is_can_sms_in.message}
              </FormHelperText>
            )}
          </FormControl>

          {/* is_can_clients */}
          <FormControl fullWidth>
            <Controller
              name='is_can_clients'
              control={control}
              rules={{ required: false }}
              render={({ field: { value, onBlur, onChange } }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={value}
                      onChange={onChange}
                      color='success'
                    />
                  }
                  label={<span>
                    {t(`Can Manage ESME`)}
                    <Tooltip title={t(`It can manage any ESMEs`)}>
                      <InfoIcon fontSize="small" color="info" sx={{ ml: 1 }} />
                    </Tooltip>
                    </span>}
                />
              )}
            />
            {errors.is_can_clients && (
              <FormHelperText sx={{ color: 'error.main', mb: 2 }}>
                {errors.is_can_clients.message}
              </FormHelperText>
            )}
          </FormControl>

          {/* is_can_client_logs */}
          <FormControl fullWidth>
            <Controller
              name='is_can_client_logs'
              control={control}
              rules={{ required: false }}
              render={({ field: { value, onBlur, onChange } }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={value}
                      onChange={onChange}
                      color='success'
                    />
                  }
                  label={<span>
                    {t(`Can Fetch ESME-Logs`)}
                    <Tooltip title={t(`It can retrieve/download SMPP-logs from any ESMEs`)}>
                      <InfoIcon fontSize="small" color="info" sx={{ ml: 1 }} />
                    </Tooltip>
                    </span>}
                />
              )}
            />
            {errors.is_can_client_logs && (
              <FormHelperText sx={{ color: 'error.main', mb: 2 }}>
                {errors.is_can_client_logs.message}
              </FormHelperText>
            )}
          </FormControl>

          <Divider />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <LoadingButton
              fullWidth={false}
              loading={isApiKeyUpdateLoading || isApiKeyCreateLoading}
              type='submit'
              variant='contained'
            >
              {t(`Save`)}
            </LoadingButton>

            {apiKeyObj ? (
              <Tooltip title={t(`Delete the api-key`)}>
                <IconButton
                  color='error'
                  onClick={handleClickDelete}
                >
                  <DeleteOutline />
                </IconButton>
              </Tooltip>
            ) : null}
          </Box>
        </form>
      } />

      <ConfirmDialog
        open={openDelete}
        setOpen={setOpenDelete}
        title={t(`Confirm API key deletion`)}
        onConfirm={handleConfirmDelete}
      />
    </Fragment>
  );
};

export default memo(EditApiKeyDialog);
