/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import Devices from "./Devices";

Netboot.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function Netboot({ ws }) {
    return (
        <>
            <h1>{_("Netboot")}</h1>
            <p>{_("Manage devices which can be booted from this router through network.")}</p>
            <Devices ws={ws} />
        </>
    );
}
