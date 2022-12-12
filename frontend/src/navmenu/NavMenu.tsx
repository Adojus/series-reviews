import { NavLink } from "react-router-dom";

import Auth from 'auth/Auth';

import './NavMenu.scss';



/**
 * Navigation menu. React component.
 * 
 * "C:\Universitetas\Karkasai\Lab_2\Lab2\frontend\src\seriesreviews.png"
 * @returns Component HTML.
 */
function NavMenu() {
	//render component HTML
	let html =		
		<header>
			<nav 
				className="
					navbar 
					shadow-sm bg-body rounded m-1 
					d-flex justify-content-between align-items-center"
				>
					
				<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1280px-Netflix_2015_logo.svg.png"
					height="30"
					className="d-inline-block align-top"
					alt=""
					style={{ marginLeft: "10px" }}/>
				<span className="d-flex">
			
					<NavLink 
						to="/" 
						className={it => "nav-link " + (it.isActive ? "active" : "")}
						>Pagrindinis</NavLink>
					<NavLink 
						to="/serialaiCrud" 
						className={it => "nav-link " + (it.isActive ? "active" : "")}
						>Serialai</NavLink>
					<NavLink 
						to="/kategorijaCrud" 
						className={it => "nav-link " + (it.isActive ? "active" : "")}
						>Kategorijos</NavLink>
					<NavLink 
						to="/aktoriusCrud" 
						className={it => "nav-link " + (it.isActive ? "active" : "")}
						>Aktoriai</NavLink>
					<NavLink 
						to="/vertinimasCrud" 
						className={it => "nav-link " + (it.isActive ? "active" : "")}
						>Vertinimai</NavLink>
				</span>
				<span>
					<Auth/>
				</span>
			</nav>
		</header>;

	//
	return html;
}

//export component
export default NavMenu;