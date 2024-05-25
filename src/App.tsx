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
import Detailvote from "./routes/detailvote";
import Votelist from "./components/votelist";

const GlobalStyles = createGlobalStyle`
  ${reset};
  * {
    box-sizing: border-box;
  }
  body {
    background: black;
    color: snow;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
    sans-serif;
  }
  hr {
    width: 80%;
    margin: 8px 20px;
  }
  
  h1 {
    font-size: 1.8rem;
    margin: 10px 20px;
    padding: 2px 4px;
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
`;

const Wrapped = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
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
		<Wrapped>
			<GlobalStyles />
			<RouterProvider router={router} />
		</Wrapped>
	);
}

export default App;
