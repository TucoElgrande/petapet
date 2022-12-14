import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { View, Image, StyleSheet, ScrollView } from "react-native";
import { Button, Text, Title } from "react-native-paper";
import CustomButton from "../components/CustomButton/CustomButton";
import CustomInput from "../components/CustomInput/CustomInput";
import { useUserContext } from "../contexts/UserContext";
import { User } from "../models/User";
import { RootStackParamList } from "../components/NavigationContainerContainer";
import { IMGURL_REGEX } from "./AddAdvertScreen";
import { EMAIL_REGEX } from "./SignUpScreen";
import Ios_extraKeyboardPadding from "../components/Ios_extraKeyboardPadding";

export default function UserScreen({ navigation }: NativeStackScreenProps<RootStackParamList>) {
  const { user, updateUser, DeleteLoggedInUser, LogOutUser } = useUserContext();
  const [editMode, setEditMode] = useState(false);
  const { control, handleSubmit } = useForm<any>({});
  console.log(user);

  async function onSubmit(data: User) {
    if (user) {
      const result = await updateUser({
        ...user,
        phoneNr: data.phoneNr ? data.phoneNr : user.phoneNr,
        profilePictureUrl: data.profilePictureUrl ? data.profilePictureUrl : user.profilePictureUrl,
        alias: data.alias ? data.alias : user.alias,
        contactEmail: data.contactEmail ? data.contactEmail : user.contactEmail,
      });

      if (result) {
        alert("User updated!");
        setEditMode(false);
      }
    }
  }

  async function deleteAccount() {
    const result = await DeleteLoggedInUser();
    if(result) {
      navigation.navigate("Main");
    } else {
      alert("something went wrong")
    }
  }

  async function handleLogOut() {
    const result = await LogOutUser();
    if(result) {
      navigation.navigate("Main");
    } else {
      alert("something went wrong")
    }
  }

  return (
    <Ios_extraKeyboardPadding>
      <ScrollView
        contentContainerStyle={{
          ...styles.container,
          height: editMode ? 700 : "90%"
        }}
      >
        <Image
          style={styles.profilePicture}
          source={{
            uri: user?.profilePictureUrl
              ? user?.profilePictureUrl
              : "https://www.pngkey.com/png/full/73-730477_first-name-profile-image-placeholder-png.png",
          }}
        />
        {editMode ? (
          <View>
            <CustomInput
              defaultValue={user?.alias}
              name='alias'
              placeholder='Alias'
              control={control}
              keyboardType={"default"}
              rules={{
                minLength: {
                  value: 3,
                  message: "Alias must be minimum 3 characters long",
                },
              }}
            />
            <CustomInput
              defaultValue={user?.phoneNr}
              name='phoneNr'
              placeholder='Phone number'
              control={control}
              keyboardType={"numeric"}
              rules={{
                pattern: { value: /^[+]?\d{8,12}$/, message: "Must be valid phone number" },
              }}
            />
            <CustomInput
              defaultValue={user?.contactEmail}
              name='contactEmail'
              placeholder='Email'
              control={control}
              keyboardType={"default"}
              rules={{
                pattern: { value: EMAIL_REGEX, message: "Must be a valid email adress" },
              }}
            />
            <CustomInput
              defaultValue={user?.profilePictureUrl}
              placeholder='Profile picture url'
              name='profilePictureUrl'
              keyboardType={"url"}
              control={control}
              rules={{
                pattern: { value: IMGURL_REGEX, message: "Must be a valid url adress" },
              }}
            />
            <View style={{ justifyContent: "center", marginLeft: "auto", marginRight: "auto" }}>
              <CustomButton text='Update profile' onPress={handleSubmit(onSubmit)} />
              <CustomButton
                text='Discard changes'
                bgColor='#c50f1f'
                onPress={() => setEditMode(false)}
              />
            </View>
          </View>
        ) : (
          <View>
            <Title>{user?.alias}</Title>
            {user?.contactEmail && <Text variant='titleSmall'>Email: {user?.contactEmail}</Text>}
            {user?.phoneNr && <Text variant='titleSmall'>Phone number: {user?.phoneNr}</Text>}
          </View>
        )}

        <View style={styles.buttonContainer}>
          {editMode ? (
            <Button mode='contained' buttonColor='#c50f1f' onPress={deleteAccount}>
              Delete account
            </Button>
          ) : (
            <Button mode='contained' buttonColor='#d0a753' onPress={handleLogOut}>
              Logout
            </Button>
          )}
          <Button mode='contained' onPress={() => setEditMode((prevState) => !prevState)}>
            Edit profile
          </Button>
        </View>
      </ScrollView>
    </Ios_extraKeyboardPadding>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    justifyContent: "space-between",
  },
  profilePicture: {
    height: 200,
    width: 200,
    borderRadius: 100,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-between",
  },
});
