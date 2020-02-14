/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { render } from "foris/testUtils/customTestRender";
import { WebSockets } from "foris";

import Netboot from "../Netboot";

describe("<Netboot />", () => {
    it("should render component", () => {
        const webSockets = new WebSockets();
        const { container } = render(<Netboot ws={webSockets} />);
        expect(container).toMatchSnapshot();
    });
});
