import * as LocalAuthentication from 'expo-local-authentication';
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, LoadingSpinner } from '../components';
import { Modal } from '../modals';
import { colors, font } from '../constants/globalStyle';
import {
  deviceHasBiometricsKey,
  haveBiometricsPermissionKey,
  havePromptedForBiometricsKey,
  userCredentialsKey,
} from '../constants/persistentStorage';
import { UserContext } from '../state/context';
import { useUser } from '../state/queries';
import { UserLogin } from '../types';
import { Storage } from '../utils';

/**
 * Modal prompting user to enable biometrics
 */
const BiometricsModal = ({
  visible,
  setVisible,
  setPersistNextLogin,
}: {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  setPersistNextLogin: Dispatch<SetStateAction<boolean>>;
}) => {
  const handleResponse = async (response: boolean) => {
    Storage.SetItemAsync(haveBiometricsPermissionKey, response);
    if (response) setPersistNextLogin(true); // do this to avoid any weirdness with re-rendering when set to false
    setVisible(false);
  };

  return (
    <Modal visible={visible}>
      <View style={modalStyles.container}>
        <Text style={[modalStyles.text, modalStyles.header]}>Enable Biometrics?</Text>
        <Text style={[modalStyles.text, modalStyles.subText]}>
          Allow budge-it to enable biometrics for future logins?
        </Text>
        <View style={modalStyles.btnContainer}>
          <Button label={'Allow'} size="medium" onPress={() => handleResponse(true)} />
          <Button
            label={"Don't Allow"}
            size="medium"
            type="secondary"
            onPress={() => handleResponse(false)}
          />
        </View>
      </View>
    </Modal>
  );
};

/**
 * Login screen for existing users
 */
const LoginScreen = ({ setSignUp }: { setSignUp: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { loginUser } = useUser();
  const [openBiometrics, setOpenBiometrics] = useState(false);
  const [persistNextLogin, setPersistNextLogin] = useState(false);

  useEffect(() => {
    // Only used for testing login flow in dev
    // change to true to reset storage then back to false
    // after it renders
    if (__DEV__ && false) {
      Storage.SetItemAsync(haveBiometricsPermissionKey, false);
      Storage.SetItemAsync(havePromptedForBiometricsKey, false);
      Storage.SetItemAsync(userCredentialsKey, false);
    }

    /**
     * First checks storage to see if we have this response already.
     * If we do, return that value.
     * If we don't, check if the device has biometrics and store
     * that response in storage.
     */
    const checkDeviceHardware = async () => {
      const deviceHasBiometrics = await Storage.GetItemAsync<boolean>(deviceHasBiometricsKey);
      if (deviceHasBiometrics) {
        return deviceHasBiometrics;
      } else {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        const result = hasHardware && isEnrolled;
        Storage.SetItemAsync(deviceHasBiometricsKey, result);
        return result;
      }
    };

    /**
     * Checks if biometrics are enabled for the user.
     * If they are, authenticate with biometrics.
     * If not, check if the user has denied biometrics.
     * If they haven't, check if the device has biometrics.
     * If they do, prompt the user to enable biometrics.
     * If they accept, prompt the device for biometrics.
     * Have user log in and store credentials.
     */
    const checkBiometrics = async () => {
      // if biometrics enabled and we have stored user credentials, authenticate with biometrics
      const userCredentials = await Storage.GetItemAsync<UserLogin>(userCredentialsKey);
      if ((await Storage.GetItemAsync<boolean>(haveBiometricsPermissionKey)) && userCredentials) {
        const result = await LocalAuthentication.authenticateAsync();
        if (result.success) {
          // log user in
          loginUser.mutate({
            email: userCredentials.email,
            password: userCredentials.password,
          });
        }
      }
      // else check if the device has biometrics
      if (await checkDeviceHardware()) {
        // check if we have already prompted the user to enable biometrics
        if (!(await Storage.GetItemAsync<boolean>(havePromptedForBiometricsKey))) {
          // if we haven't, prompt the user to enable biometrics
          setOpenBiometrics(true);
          Storage.SetItemAsync(havePromptedForBiometricsKey, true);
        }
      }
    };
    checkBiometrics();
  }, [loginUser]);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={styles.form}>
        {loginUser.isPending && <LoadingSpinner />}
        <View style={styles.section}>
          <TextInput
            placeholder="Username"
            autoCapitalize="none"
            textContentType="emailAddress"
            onChangeText={setUsername}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            autoCapitalize="none"
            secureTextEntry={true}
            textContentType="password"
            onChangeText={setPassword}
            style={styles.input}
          />
          {persistNextLogin && <Text style={styles.text}>Biometrics enabled for next login</Text>}
        </View>
        <View style={styles.section}>
          <Button
            label="Log In"
            size="large"
            onPress={async () => {
              if (persistNextLogin) {
                // store credentials
                Storage.SetItemAsync(userCredentialsKey, { email: username, password: password });
                // don't think I need to run the below line, but leaving it here as a reminder
                // setPersistNextLogin(false);
              }
              loginUser.mutate({
                email: username,
                password: password,
              });
            }}
          />
          <Button label="Create Account" size="large" type="secondary" onPress={setSignUp} />
        </View>
      </KeyboardAvoidingView>
      <BiometricsModal
        visible={openBiometrics}
        setVisible={setOpenBiometrics}
        setPersistNextLogin={setPersistNextLogin}
      />
    </View>
  );
};

/**
 * Sign up screen for new users
 */
const SignUpScreen = ({ setLogIn }: { setLogIn: () => void }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const { createUser } = useUser();

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={styles.form}>
        {createUser.isPending && <LoadingSpinner />}
        <View style={styles.section}>
          <TextInput placeholder="First Name" onChangeText={setFirstName} style={styles.input} />
          <TextInput placeholder="Last Name" onChangeText={setLastName} style={styles.input} />
          <TextInput
            placeholder="Username"
            autoCapitalize="none"
            onChangeText={setUsername}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            autoCapitalize="none"
            secureTextEntry={true}
            onChangeText={setPassword}
            style={styles.input}
          />
          <TextInput
            placeholder="Confirm Password"
            autoCapitalize="none"
            secureTextEntry={true}
            onChangeText={setPasswordConfirm}
            style={styles.input}
          />
        </View>
        <View style={styles.section}>
          <Button
            label="Sign Up"
            size="large"
            onPress={() => {
              // TODO: Validate inputs and show error messages under inputs if invalid
              if (password !== passwordConfirm) {
                Alert.alert('Passwords do not match');
                return;
              }
              createUser.mutate({
                firstName: firstName,
                lastName: lastName,
                email: username,
                password: password,
              });
            }}
          />
          <Button label="Log In" size="large" type="secondary" onPress={setLogIn} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

/**
 * Login component that shows children if logged in, otherwise shows login screen
 */
export function Login({ children }: { children: React.ReactNode }) {
  const [isLogIn, setIsLogIn] = useState(true);
  const { user } = useContext(UserContext);

  if (user) {
    return <>{children}</>;
  }

  return (
    <SafeAreaView style={styles.safeView}>
      {isLogIn ? (
        <LoginScreen setSignUp={() => setIsLogIn(false)} />
      ) : (
        <SignUpScreen setLogIn={() => setIsLogIn(true)} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: colors.temp.gray,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.temp.gray,
    height: '100%',
  },
  form: {
    padding: 20,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  input: {
    backgroundColor: colors.temp.white,
    padding: 10,
    borderRadius: 5,
  },
  text: {
    color: colors.temp.black,
    fontFamily: font.semiBold,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

const modalStyles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  text: {
    color: 'black',
    alignSelf: 'center',
  },
  header: {
    fontFamily: font.extraBold,
    fontSize: 24,
  },
  subText: {
    fontFamily: font.semiBold,
    fontSize: 16,
  },
  btnContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
});
