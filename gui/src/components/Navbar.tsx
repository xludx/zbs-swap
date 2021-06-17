import React, { Component } from 'react';
import Identicon from 'identicon.js';

type NavbarProps = {
  account: string,
}

type NavbarState = {
}

class Navbar extends Component<NavbarProps, NavbarState> {

  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a className="navbar-brand col-sm-3 col-md-2 mx-3" href="/#">
          ZBS Swap
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-sm-block">
            <small id="account" className="text-secondary px-3">{this.props.account}</small>
            {
              this.props.account
                  ? <img
                      className="ml-2"
                      width="30"
                      height="30"
                      src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                      alt=""
                  />
                  : <span></span>
            }
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
