/*
 * Copyright (C) 2020-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import PropTypes from "prop-types";

import "./DevicesTable.css";
import DevicesTableRow, { deviceShape } from "./DevicesTableRow";

DevicesTable.propTypes = {
    devices: PropTypes.arrayOf(deviceShape).isRequired,
    acceptDevice: PropTypes.func.isRequired,
    unpairDevice: PropTypes.func.isRequired,
};

export default function DevicesTable({ devices, acceptDevice, unpairDevice }) {
    if (!devices || devices.length === 0) {
        return (
            <p className="text-muted text-center mb-0">
                {_("No netboot devices available.")}
            </p>
        );
    }

    return (
        <div className="table-responsive">
            <table className="table table-hover netboot-devices-table">
                <thead className="thead-light">
                    <tr>
                        <th scope="col" className="netboot-serial-number">
                            {_("Serial Number")}
                        </th>
                        <th scope="col" className="netboot-status">
                            {_("Paired")}
                        </th>
                        <th
                            scope="col"
                            className="netboot-action"
                            aria-label={_("Change status")}
                        >
                            {_("Action")}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {devices.map((device) => (
                        <DevicesTableRow
                            key={device.serial}
                            device={device}
                            acceptDevice={acceptDevice}
                            unpairDevice={unpairDevice}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
