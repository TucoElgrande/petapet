import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import { Text, BackHandler, ScrollView } from "react-native";
import { RootStackParamList } from "../components/NavigationContainerContainer";
import { useAdverts } from "../contexts/AdvertContext";
import { Advert } from "../models/Advert";
import ContactUserButton from "../components/AdvertComponents/ContactUserButtons";
import { Card, Title, Paragraph, IconButton, Button } from "react-native-paper";
import { StyleSheet } from "react-native";
import StarRating from "../components/AdvertComponents/StarRating";
import { useUserContext } from "../contexts/UserContext";

type Props = NativeStackScreenProps<RootStackParamList, "AdvertDetails">;

export default function AdvertDetailsScreen({ route, navigation }: Props) {
  const [advert, setAdvert] = useState<Advert>();
  const [advertId] = useState(route.params.advertId);
  const [visibility, setVisibility] = useState(false);
  const { getAdvertById, getNextAdvert } = useAdverts();
  const [liked, setLiked] = useState(false);
  const { user } = useUserContext();
  const touchX = useRef(0);

  useEffect(() => {
    getAdvertById(advertId).then((advert) => setAdvert(advert));
  }, [advertId]);

  useEffect(() => {
    const backButtonEvent = BackHandler.addEventListener("hardwareBackPress", () => {
      navigation.navigate("Main");
      return true;
    });
    return () => backButtonEvent.remove();
  }, []);

  function nextAdvert() {
    const nextId = getNextAdvert(advertId);
    if (nextId !== "") {
      navigation.push("AdvertDetails", { advertId: nextId });
    }
  }

  function toggleVisibility() {
    setVisibility((prevState) => !prevState);
  }

  return (
    <>
      <ScrollView
        style={{ height: "100%" }}
        onTouchStart={(e) => (touchX.current = e.nativeEvent.pageX)}
        onTouchEnd={(e) => {
          if (touchX.current - e.nativeEvent.pageX > 20) {
            nextAdvert();
          } else if (e.nativeEvent.pageX - touchX.current > 20) {
            navigation.goBack();
          }
        }}
      >
        <Card elevation={5} style={styles.centered}>
          <Card.Title
            title=''
            left={(props) => <StarRating {...props} grade={advert?.grade ?? 3} />}
            right={(props) => (
              <IconButton
                {...props}
                iconColor={liked ? "red" : "#49454f"}
                icon={liked ? "heart" : "heart-outline"}
                onPress={() => setLiked((prevState) => !prevState)}
              />
            )}
          />
          <Card.Cover source={{ uri: advert?.imageUrls }} style={{ height: 400 }} />
          <Card.Content>
            <Title>{advert?.name}</Title>
            <Paragraph>Age: {advert?.age}</Paragraph>
            <Paragraph>Personality: {advert?.personallity}</Paragraph>
            <Paragraph>Rent period (hour): {advert?.rentPeriod}</Paragraph>
            <Paragraph>Race: {advert?.race}</Paragraph>
            <Paragraph>Sex: {advert?.sex}</Paragraph>
          </Card.Content>
          {user && (
            <Button
              onPress={() => {
                toggleVisibility();
              }}
            >
              <Text>Contact owner</Text>
            </Button>
          )}

          {visibility && <ContactUserButton userId={advert?.userId} />}
        </Card>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  centered: {
    width: "95%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 10,
    marginBottom: 10,
  },
});
