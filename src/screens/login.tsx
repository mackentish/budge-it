import * as LocalAuthentication from 'expo-local-authentication';
import { useForm, Controller } from 'react-hook-form';
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
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
  const { loginUser } = useUser();
  const [openBiometrics, setOpenBiometrics] = useState(false);
  const [persistNextLogin, setPersistNextLogin] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });
  async function onSubmit(data: { username: string; password: string }) {
    if (persistNextLogin) {
      // store credentials
      Storage.SetItemAsync(userCredentialsKey, { email: data.username, password: data.password });
      // don't think I need to run the below line, but leaving it here as a reminder
      // setPersistNextLogin(false);
    }
    loginUser.mutate({
      email: data.username,
      password: data.password,
    });
  }

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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.form}
      >
        <View style={styles.inner}>
          {loginUser.isPending && <LoadingSpinner />}
          <View style={styles.section}>
            {/** Username */}
            <View style={styles.inputGroup}>
              <Controller
                control={control}
                rules={{
                  required: 'Missing username.',
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Username"
                    autoCapitalize="none"
                    textContentType="emailAddress"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.input, errors.username && styles.errorInput]}
                  />
                )}
                name="username"
              />
              {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}
            </View>

            {/** Password */}
            <View style={styles.inputGroup}>
              <Controller
                control={control}
                rules={{
                  required: 'Missing password.',
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Password"
                    autoCapitalize="none"
                    secureTextEntry={true}
                    textContentType="password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.input, errors.password && styles.errorInput]}
                  />
                )}
                name="password"
              />
              {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
            </View>
            {persistNextLogin && <Text style={styles.text}>Biometrics enabled for next login</Text>}
          </View>
          <View style={styles.section}>
            <Button label="Log In" size="large" onPress={handleSubmit(onSubmit)} />
            <Button label="Create Account" size="large" type="secondary" onPress={setSignUp} />
          </View>
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
  const { createUser } = useUser();
  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { isSubmitted, errors },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      passwordConfirm: '',
    },
  });
  const password = watch('password', ''); // Get the value of the password field

  function onSubmit(data: {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    passwordConfirm: string;
  }) {
    if (data.password !== data.passwordConfirm) {
      setError('passwordConfirm', {
        type: 'manual',
        message: 'Passwords do not match.',
      });
      return;
    }
    createUser.mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.username,
      password: data.password,
    });
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.form}
      >
        <View style={styles.inner}>
          {createUser.isPending && <LoadingSpinner />}
          <View style={styles.section}>
            {/** First Name */}
            <View style={styles.inputGroup}>
              <Controller
                control={control}
                rules={{
                  required: 'This is required.',
                  maxLength: 100,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="First Name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.input, errors.firstName && styles.errorInput]}
                  />
                )}
                name="firstName"
              />
              {errors.firstName && <Text style={styles.error}>{errors.firstName.message}</Text>}
            </View>

            {/** Last Name */}
            <View style={styles.inputGroup}>
              <Controller
                control={control}
                rules={{
                  required: 'This is required.',
                  maxLength: 100,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Last Name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.input, errors.lastName && styles.errorInput]}
                  />
                )}
                name="lastName"
              />
              {errors.lastName && <Text style={styles.error}>{errors.lastName.message}</Text>}
            </View>

            {/** Username */}
            <View style={styles.inputGroup}>
              <Controller
                control={control}
                rules={{
                  required: 'This is required.',
                  maxLength: 100,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Username"
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.input, errors.lastName && styles.errorInput]}
                  />
                )}
                name="username"
              />
              {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}
            </View>

            {/** Password */}
            <View style={styles.inputGroup}>
              <Controller
                control={control}
                rules={{
                  required: 'This is required.',
                  maxLength: 100,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Password"
                    autoCapitalize="none"
                    secureTextEntry={true}
                    textContentType="password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.input, errors.password && styles.errorInput]}
                  />
                )}
                name="password"
              />
              {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
            </View>

            {/** Confirm Password */}
            <View style={styles.inputGroup}>
              <Controller
                control={control}
                rules={{
                  required: 'This is required.',
                  maxLength: 100,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Confirm Password"
                    autoCapitalize="none"
                    secureTextEntry={true}
                    textContentType="password"
                    onBlur={onBlur}
                    onChangeText={value => {
                      onChange(value);
                      if (value !== password) {
                        setError('passwordConfirm', {
                          type: 'manual',
                          message: 'Passwords do not match.',
                        });
                      }
                      if (isSubmitted) {
                        // Validate on change if form has been submitted
                        handleSubmit(onSubmit);
                      }
                    }}
                    value={value}
                    style={[styles.input, errors.passwordConfirm && styles.errorInput]}
                  />
                )}
                name="passwordConfirm"
              />
              {errors.passwordConfirm && (
                <Text style={styles.error}>{errors.passwordConfirm.message}</Text>
              )}
            </View>
          </View>
          <View style={styles.section}>
            <Button label="Sign Up" size="large" onPress={handleSubmit(onSubmit)} />
            <Button label="Log In" size="large" type="secondary" onPress={setLogIn} />
          </View>
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
    flex: 1,
    backgroundColor: colors.temp.gray,
  },
  inner: {
    flex: 1,
    justifyContent: 'space-between',
  },
  form: {
    flex: 1,
    padding: 20,
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
  errorInput: {
    borderColor: colors.temp.red,
    borderWidth: 1,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  text: {
    color: colors.temp.black,
    fontFamily: font.semiBold,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  error: {
    color: colors.temp.red,
    fontFamily: font.regular,
    fontSize: 12,
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
