import React from "react";
import { connect } from "react-redux";
import {
  Box,
  Flex,
  Avatar,
  Link,
  Button,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  // useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
} from "@chakra-ui/react";
import FacebookLogin from "react-facebook-login";
import { FaMoon, FaSun } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import { login, logout } from "../../services/actions";

const NavLink = ({ href, children }) => (
  <Button
    display={{ base: "none", md: "inline-flex" }}
    fontSize={"md"}
    fontWeight={500}
    variant={"link"}
  >
    <RouterLink to={href}>{children}</RouterLink>
  </Button>
);

function Header({ loginHandler, logOutHandler, userAuth }) {
  const { colorMode, toggleColorMode } = useColorMode();
  // const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
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
                    {/* <MenuItem>
                      <RouterLink to={"/profile"}>Profile</RouterLink>
                    </MenuItem> */}
                    <MenuItem>
                      <Link color="teal.500" onClick={() => logOutHandler()}>
                        Logout
                      </Link>
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <Box w="100%">
                  <FacebookLogin
                    appId="790248245606669"
                    autoLoad={true}
                    fields="name,email,picture.type(large)"
                    scope="public_profile,,instagram_basic,instagram_content_publish,instagram_manage_insights,instagram_manage_comments"
                    callback={loginHandler}
                    icon="fa-facebook"
                  />
                </Box>
              )}
            </Stack>
          </Flex>
        </Flex>
      </Box>
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
