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
  Tag,
  TagLabel,
  TagCloseButton,
  Progress,
  useColorModeValue,
  Textarea,
  Link,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

import { useState } from "react";
import { connect } from "react-redux";

import axios from "axios";

import * as filestack from "filestack-js";

const baseURL = `${window.location.protocol}//${window.location.host}`;
console.log("Base URL: ", baseURL);

const client = axios.create({
  baseURL: `${baseURL}/.netlify/functions`,
  // baseURL: "http://localhost:57461",
  headers: {
    /* Required for CORS support to work */
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    Accept: "application/json",
  },
});

function App({ userAuth }) {
  let access_token = userAuth?.user?.accessToken;
  let instagram_account_id = userAuth?.user?.userID;
  let [postFile, setPostFile] = useState([]);
  let [caption, setCaption] = useState("");
  let [scheduleDateTime, setScheduleDateTime] = useState(
    new Date().toISOString().slice(0, 16)
  );

  let [fileUploadProgress, setFileUploadProgress] = useState({
    display: false,
    progressValue: 0,
    isIndeterminate: false,
  });

  let [instagramApiResp, setInstagramApiResp] = useState({
    imageMediaObjectId: null,
    imageMediaStatusCode: null,
    publishImageResponse: null,
  });

  const fileStackClient = filestack.init(
    process.env.REACT_APP_FILE_STACK_API_KEY
  );

  let handlePostFileChange = (e) => {
    setFileUploadProgress({
      display: true,
      progressValue: 0,
      isIndeterminate: true,
    });
    fileStackClient
      .multiupload(
        e.target.files,
        {
          onProgress: (event) =>
            setFileUploadProgress((current) => {
              if (event.totalPercent >= 0 && event.totalPercent <= 20) {
                return {
                  display: true,
                  progressValue: event.totalPercent,
                  isIndeterminate: true,
                };
              } else {
                return {
                  display: true,
                  progressValue: event.totalPercent,
                  isIndeterminate: false,
                };
              }
            }),
        },
        {},
        {}
      )
      .then((res) => {
        setFileUploadProgress(() => {
          return {
            display: false,
            progressValue: 0,
            isIndeterminate: false,
          };
        });
        let postFileArr = [];
        res.forEach((file) => {
          postFileArr.push({
            name: file.name,
            url: file.url,
            mimeType: file.mimetype,
          });
        });
        setPostFile([...postFile, ...postFileArr]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let handlePostSubmit = () => {
    const PARAMS = {
      postFile: postFile,
      caption: caption,
      scheduleDateTime: scheduleDateTime,
      access_token: access_token,
      instagram_account_id: instagram_account_id,
    };

    // createMediaObject
    client.post("/createMediaObject", PARAMS).then((response) => {
      console.log("/postContent API RES :::: ", response);
      setInstagramApiResp({
        ...instagramApiResp,
        imageMediaObjectId: response.data.resp,
      });
    });

    // getMediaObjectStatus
    client
      .post("/getMediaObjectStatus", {
        ...PARAMS,
        imageMediaObjectId: instagramApiResp.imageMediaObjectId,
      })
      .then((response) => {
        console.log("/postContent API RES :::: ", response);
        setInstagramApiResp({
          ...instagramApiResp,
          imageMediaStatusCode: response.data.resp,
        });
      });

    // publishMedia
    client
      .post("/publishMedia", {
        ...PARAMS,
        imageMediaObjectId: instagramApiResp.imageMediaObjectId,
      })
      .then((response) => {
        console.log("/postContent API RES :::: ", response);
        setInstagramApiResp({
          ...instagramApiResp,
          publishImageResponse: response.data.resp,
        });
      });

    // getContentPublishingLimit
    client.post("/getContentPublishingLimit", PARAMS).then((response) => {
      console.log("/postContent API RES :::: ", response);
      setInstagramApiResp({
        ...instagramApiResp,
        contentPublishingApiLimit: response.data.resp,
      });
    });
  };

  // getLongLivedAccessToken
  client
    .post("/getLongLivedAccessToken", {
      access_token: userAuth?.user?.accessToken,
      instagram_account_id: userAuth?.user?.userID,
      redirect_uri: baseURL,
    })
    .then((response) => {
      console.log("/postContent API RES :::: ", response);
    });

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        {/* <div>
          <pre>{JSON.stringify(instagramApiResp, null, 2)}</pre>
        </div> */}
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
              <Progress
                display={fileUploadProgress.display ? "block" : "none"}
                isIndeterminate={fileUploadProgress.isIndeterminate}
                value={fileUploadProgress.progressValue}
                size="xs"
                colorScheme="green"
                mt={4}
              />
              <Wrap mt={4} spacing={4}>
                {postFile.map((file, index) => {
                  return (
                    <WrapItem key={index}>
                      <Tag
                        size={"md"}
                        borderRadius="full"
                        variant="solid"
                        colorScheme="green"
                      >
                        <TagLabel>
                          <Link target={"_blank"} href={file.url}>
                            {file.name}
                          </Link>
                        </TagLabel>
                        <TagCloseButton
                          onClick={(e) => {
                            setPostFile(
                              postFile.filter(
                                (currentFile) => currentFile.url !== file.url
                              )
                            );
                          }}
                        />
                      </Tag>
                    </WrapItem>
                  );
                })}
              </Wrap>
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
