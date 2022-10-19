import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  Progress,
  useColorModeValue,
  Textarea,
} from "@chakra-ui/react";

import { useState } from "react";
import { connect } from "react-redux";

import axios from "axios";

import * as filestack from "filestack-js";

const baseURL = window.location.protocol + "//" + window.location.host + "/api";
console.log("Base URL: ", baseURL);

const client = axios.create({
  //   baseURL: baseURL,
  baseURL: "http://localhost:61714",
  headers: { "Content-Type": "multipart/form-data" },
});

function App({ userAuth }) {
  let access_token = userAuth?.user?.access_token;
  let instagram_account_id = userAuth?.user?.userID;
  let [postFile, setPostFile] = useState([]);
  let [caption, setCaption] = useState("");
  let [scheduleDateTime, setScheduleDateTime] = useState("");

  let [fileUploadProgress, setFileUploadProgress] = useState({
    display: false,
    progressValue: 0,
    isIndeterminate: false,
  });

  const fileStackClient = filestack.init(
    process.env.REACT_APP_FILE_STACK_API_KEY
  );

  const handlePostFile = (file) => {
    setPostFile((current) => [...current, file]);
  };

  let handlePostFileChange = (e) => {
    fileStackClient
      .multiupload(
        e.target.files,
        {
          onProgress: (event) =>
            setFileUploadProgress((current) => {
              current.display = true;
              current.progressValue = event.totalPercent;
              return current;
            }),
        },
        {},
        {}
      )
      .then((res) => {
        console.log(".then(res) : ", res);
        setFileUploadProgress((current) => {
          current.display = false;
          current.progressValue = 0;
          current.isIndeterminate = false;
          console.log(current);
          return current;
        });
        res.forEach((file) => {
          handlePostFile({
            url: file.url,
            mimeType: file.mimetype,
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let handlePostSubmit = () => {
    let formData = new FormData();
    formData.append("postFile", postFile);
    formData.append("caption", caption);
    formData.append("scheduleDateTime", scheduleDateTime);
    formData.append("access_token", access_token);
    formData.append("instagram_account_id", instagram_account_id);

    client.post("/postContent", formData).then((response) => {
      console.log("/postContent API RES :::: ", response);
    });
  };
  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Upload a Post to Instagram
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="file" isRequired>
              <FormLabel>Post</FormLabel>
              <Input
                pt={1}
                type="file"
                multiple
                onChange={handlePostFileChange}
              />
              {fileUploadProgress.display ? "TRUE" : "FALSE"}{" "}
              {fileUploadProgress.progressValue}{" "}
              {fileUploadProgress.isIndeterminate ? "TRUE" : "FALSE"}
              <Progress
                // display={fileUploadProgress.display ? "block" : "none"}
                isIndeterminate={fileUploadProgress?.isIndeterminate}
                value={fileUploadProgress?.progressValue}
                size="xs"
                colorScheme="green"
                mt={4}
              />
            </FormControl>
            <FormControl id="caption" isRequired>
              <FormLabel>Caption</FormLabel>
              <Textarea
                placeholder="Type caption to this post here .."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </FormControl>
            <FormControl id="schedule-date" isRequired>
              <FormLabel>Schedule Date Time</FormLabel>
              <Input
                type="datetime-local"
                value={scheduleDateTime}
                onChange={(e) => setScheduleDateTime(e.target.value)}
              />
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Posting..."
                size="lg"
                bg={"green.400"}
                color={"white"}
                _hover={{
                  bg: "green.500",
                }}
                onClick={handlePostSubmit}
              >
                Post
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {};
};

const mapStateToProps = (state) => {
  return {
    userAuth: state.userAuth,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
