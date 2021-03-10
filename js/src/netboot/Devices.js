/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import { API_STATE, Spinner, ErrorMessage } from "foris";

import DevicesTable from "./DevicesTable";
import {
    useLoadDevices,
    useAcceptDevice,
    useUpdateOnAccept,
    useUnpairDevice,
    useUpdateOnUnpair,
} from "./hooks";

Devices.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function Devices({ ws }) {
    const [devices, setDevices] = useState([]);

    const loadDevicesState = useLoadDevices(setDevices);

    const [acceptState, acceptDevice] = useAcceptDevice();
    useUpdateOnAccept(ws, setDevices);

    const [unpairState, unpairDevice] = useUnpairDevice();
    useUpdateOnUnpair(ws, setDevices);

    if (
        loadDevicesState === API_STATE.INIT ||
        [loadDevicesState, acceptState, unpairState].includes(API_STATE.SENDING)
    ) {
        return <Spinner />;
    }
    if (loadDevicesState === API_STATE.ERROR) {
        return <ErrorMessage />;
    }
    return (
        <DevicesTable
            devices={devices}
            acceptDevice={acceptDevice}
            unpairDevice={unpairDevice}
        />
    );
}
