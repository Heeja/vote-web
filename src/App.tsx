import { RouterProvider, createBrowserRouter } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

import Home from "./components/home";
import User from "./components/user";
import Vote from "./components/vote";

import Login from "./routes/login";
import Join from "./routes/join";
import Createvote from "./routes/createvote";
import Userinfo from "./routes/userinfo";
import Managevote from "./routes/managevote";
import ProtectedRoute from "./components/protectedRoute";
import Votelist from "./components/votelist";
import Detailvote from "./components/detailvote";

const GlobalStyles = createGlobalStyle`
  ${reset};
  * {
    box-sizing: border-box;
  }
  body {
    /* background: black; */
	background: #717171;
    color: snow;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
    sans-serif;
  }
  hr {
    width: 100%;
	border-color: "#c1c1c1";
	margin: 0.5rem 0;
  }
  
  h1 {
    font-size: 1.3rem;
    padding: 1px 2px;
  }
  h2 {
	font-size: 1.2rem;
  }
  h3 {
	  font-size: 1.1rem;
	}
  a {
    color: snow;

    :hover {
      cursor: pointer;
    }
  }

  button {
    border: none;
    border-radius: 1rem;
    :hover {
      cursor: pointer;
    }
  }
  #root {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100vh;
  }
`;

const Wrapped = styled.div`
	display: flex;
	flex-direction: column;
	/* justify-content: center; */
	align-items: center;
	width: 100%;
	height: 100%;
`;

const MobileSize = styled.div`
	align-self: center;
	width: 360px;
	height: 735px;
	border: 0.1rem solid #fff;
	border-radius: 1rem;
	padding: 16px 18px;
`;

// router
const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/join",
		element: <Join />,
	},
	{
		path: "/user",
		element: (
			<ProtectedRoute>
				<User />
			</ProtectedRoute>
		),
		children: [
			{
				path: "createvote",
				element: <Createvote />,
			},
			{
				path: "userinfo",
				element: <Userinfo />,
			},
			{
				path: "managevote",
				element: <Managevote />,
				children: [
					{
						path: "",
						element: <Votelist />,
					},
					{ path: ":id", element: <Detailvote /> },
				],
			},
		],
	},
	{
		path: "/vote/:id",
		element: <Vote />,
	},
]);

function App() {
	return (
		<MobileSize>
			<Wrapped>
				<GlobalStyles />
				<RouterProvider router={router} />
			</Wrapped>
		</MobileSize>
	);
}

export default App;
