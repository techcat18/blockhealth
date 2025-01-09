import { observer } from "mobx-react-lite";
import { useStoreContext } from "../../store";
import { Alert, Snackbar } from "@mui/material";

export const SnackBar = observer(() => {
  const {
    snackBarStore: { snackBarOptions, closeSnackBar },
  } = useStoreContext();
  const { open, severity, message } = snackBarOptions;

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      open={open}
      autoHideDuration={5000}
      onClose={closeSnackBar}
      ClickAwayListenerProps={{ onClickAway: () => null }}
    >
      <Alert
        onClose={closeSnackBar}
        severity={severity}
        variant={"filled"}
        color={severity}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
});
