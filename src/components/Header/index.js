import React from "react";
import { connect } from "react-redux";
import {
  Box,
  Flex,
  Avatar,
  Link,
  Button,
  Image,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  HStack,
  IconButton,
  useColorMode,
  Center,
  Switch,
} from "@chakra-ui/react";
import {
  FaFacebook,
  FaMoon,
  FaSun,
  FaWindowClose,
  FaBars,
} from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import { login, logout } from "../../services/actions";

const Links = [
  {
    name: "App",
    route: "/app",
  },
  {
    name: "Profile",
    route: "/profile",
  },
  {
    name: "Contact",
    route: "/contact",
  },
];

const NavLink = ({ href, children }) => (
  <Button
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
  >
    <RouterLink to={href}>{children}</RouterLink>
  </Button>
);

function Header({ loginHandler, logOutHandler, userAuth }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={
              isOpen ? (
                <FaWindowClose style={{ display: "unset" }} />
              ) : (
                <FaBars style={{ display: "unset" }} />
              )
            }
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box boxSize="100px">
              <RouterLink to={"/"}>
                <Image
                  w={"-webkit-fit-content"}
                  h={"unset"}
                  mt="24px"
                  objectFit="cover"
                  src={require(`../../assets/${colorMode}-logo.png`)}
                  alt="InstBit"
                />
              </RouterLink>
            </Box>
          </HStack>
          <Flex alignItems={"center"}>
            <HStack
              as={"nav"}
              mr={4}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link, index) => (
                <NavLink key={index} href={link.route}>
                  {link.name}
                </NavLink>
              ))}
              <Button
                display={{ base: "none", md: "inline-flex" }}
                fontSize={"lg"}
                fontWeight={600}
                variant={"link"}
                onClick={toggleColorMode}
              >
                {colorMode === "light" ? <FaMoon /> : <FaSun />}
              </Button>
            </HStack>
            {!userAuth?.isLoggedin ? (
              <Center p={"0 8 0"}>
                <Button
                  w={"full"}
                  maxW={"md"}
                  colorScheme={"facebook"}
                  leftIcon={<FaFacebook />}
                  onClick={(event) => {
                    window.FB.login(
                      function (response) {
                        if (response.authResponse) {
                          loginHandler(response.authResponse);
                          window.FB.api(
                            "/me",
                            { fields: "name,email,picture.type(large)" },
                            function (response) {
                              loginHandler(response);
                            }
                          );
                        } else {
                          console.log(
                            "User cancelled login or did not fully authorize."
                          );
                        }
                      },
                      {
                        scope:
                          "public_profile,instagram_basic,instagram_content_publish,instagram_manage_insights,instagram_manage_comments",
                        return_scopes: true,
                      }
                    );
                  }}
                >
                  <Center>
                    <Text>Continue with Facebook</Text>
                  </Center>
                </Button>
              </Center>
            ) : (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar
                    size={"sm"}
                    src={userAuth?.user?.picture?.data?.url}
                  />
                </MenuButton>
                <MenuList alignItems={"center"}>
                  <br />
                  <Center>
                    <Avatar
                      size={"2xl"}
                      src={userAuth?.user?.picture?.data?.url}
                    />
                  </Center>
                  <br />
                  <Center>
                    <p>{userAuth?.user?.name}</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem>
                    <Link color="teal.500" onClick={() => logOutHandler()}>
                      Logout
                    </Link>
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {/* <NavLink> */}
              <HStack>
                <Text>Dark Mode: </Text>
                <Switch
                  id="isChecked"
                  colorScheme={"green"}
                  onChange={toggleColorMode}
                  isChecked={colorMode !== "light" ? true : false}
                />
              </HStack>

              {/* {colorMode === "light" ? <FaMoon /> : <FaSun />} */}
              {/* </NavLink> */}
              {Links.map((link, index) => (
                // <NavLink key={link}>
                <RouterLink key={index} to={link.route}>
                  {link.name}
                </RouterLink>
                // </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>

      {/* <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box boxSize="100px">
            <NavLink href={"/"}>
              <Image
                w={"-webkit-fit-content"}
                h={"unset"}
                mt="25px"
                objectFit="cover"
                src={require(`../../assets/${colorMode}-logo.png`)}
                alt="InstBit"
              />
            </NavLink>
          </Box>

          <Flex alignItems={"center"}>
            <Stack
              flex={{ base: 1, md: 2 }}
              justify={"flex-end"}
              direction={"row"}
              spacing={6}
            >
              <NavLink href={"/app"}>App</NavLink>
              <NavLink href={"/profile"}>Profile</NavLink>
              <NavLink href={"/contact"}>Contact</NavLink>
              <Button
                display={{ base: "none", md: "inline-flex" }}
                fontSize={"lg"}
                fontWeight={600}
                variant={"link"}
                onClick={toggleColorMode}
              >
                {colorMode === "light" ? <FaMoon /> : <FaSun />}
              </Button>
              {userAuth?.isLoggedin ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar
                      size={"sm"}
                      src={userAuth?.user?.picture?.data?.url}
                    />
                  </MenuButton>
                  <MenuList alignItems={"center"}>
                    <br />
                    <Center>
                      <Avatar
                        size={"2xl"}
                        src={userAuth?.user?.picture?.data?.url}
                      />
                    </Center>
                    <br />
                    <Center>
                      <p>{userAuth?.user?.name}</p>
                    </Center>
                    <br />
                    <MenuDivider />
                    <MenuItem>
                      <Link color="teal.500" onClick={() => logOutHandler()}>
                        Logout
                      </Link>
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <Box w="100%">
                  <Center p={"0 8 0"}>
                    <Button
                      w={"full"}
                      maxW={"md"}
                      colorScheme={"facebook"}
                      leftIcon={<FaFacebook />}
                      onClick={(event) => {
                        window.FB.login(
                          function (response) {
                            if (response.authResponse) {
                              loginHandler(response.authResponse);
                              window.FB.api(
                                "/me",
                                { fields: "name,email,picture.type(large)" },
                                function (response) {
                                  loginHandler(response);
                                }
                              );
                            } else {
                              console.log(
                                "User cancelled login or did not fully authorize."
                              );
                            }
                          },
                          {
                            scope:
                              "public_profile,instagram_basic,instagram_content_publish,instagram_manage_insights,instagram_manage_comments",
                            return_scopes: true,
                          }
                        );
                      }}
                    >
                      <Center>
                        <Text>Continue with Facebook</Text>
                      </Center>
                    </Button>
                  </Center>

                </Box>
              )}
            </Stack>
          </Flex>
        </Flex>
      </Box> */}
    </>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginHandler: (data) => {
      console.log("Login Handler");
      dispatch(login(data));
    },
    logOutHandler: (data) => {
      dispatch(logout(data));
    },
    dispatch: dispatch,
  };
};

const mapStateToProps = (state) => {
  return {
    userAuth: state.userAuth,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
