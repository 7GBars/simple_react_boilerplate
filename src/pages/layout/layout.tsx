import React, {FC} from 'react';
import {Link, Outlet} from "react-router-dom";

import './layout.scss';

type TLayoutProps = {

};

export const Layout: FC<TLayoutProps> = props => {
  return (
    <div className={'main-layout-container'}>
      <nav className={'main-layout-container__nav'}>
            <Link to="/">Main</Link>
            <Link to="/book">Book</Link>
      </nav>

        <Outlet />

    </div>
  );
};


