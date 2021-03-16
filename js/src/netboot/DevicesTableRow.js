/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import { Button, SpinnerElement } from "foris";

import "./DevicesTable.css";
import DEVICE_STATES from "./deviceStates";

export const deviceShape = PropTypes.shape({
    serial: PropTypes.string.isRequired,
    state: PropTypes.oneOf(Object.values(DEVICE_STATES)),
});

DevicesTableRow.propTypes = {
    device: deviceShape.isRequired,
    acceptDevice: PropTypes.func.isRequired,
    unpairDevice: PropTypes.func.isRequired,
};

export default function DevicesTableRow({
    device,
    acceptDevice,
    unpairDevice,
}) {
    let actionButton;
    if (device.state === DEVICE_STATES.ACCEPTED) {
        actionButton = (
            <UnpairButton serial={device.serial} unpairDevice={unpairDevice} />
        );
    } else if (device.state === DEVICE_STATES.INCOMING) {
        actionButton = (
            <AcceptButton serial={device.serial} acceptDevice={acceptDevice} />
        );
    }

    return (
        <tr>
            <td>{device.serial}</td>
            <td className="text-center">
                {device.state === DEVICE_STATES.TRANSFERING ? (
                    <SpinnerElement />
                ) : (
                    <StatusIcon
                        key={`${device.serial}-${device.state}`}
                        status={device.state}
                    />
                )}
            </td>
            <td className="text-center">{actionButton}</td>
        </tr>
    );
}

StatusIcon.propTypes = {
    status: PropTypes.string,
};

function StatusIcon({ status }) {
    let className = "fa-question-circle text-warning";
    let statusDescription = _("Unknown status");

    if (status === DEVICE_STATES.ACCEPTED) {
        className = "fa-check-circle text-success";
        statusDescription = _("Paired");
    } else if (status === DEVICE_STATES.INCOMING) {
        className = "fa-times-circle text-primary";
        statusDescription = _("Awaiting acceptance");
    }

    /*
     * Wrapper tag is required to properly remove icon because "i" element
     * is actually replaced by "svg" element.
     */
    return (
        <span>
            <i className={`fa fa-lg ${className}`} title={statusDescription} />
        </span>
    );
}

UnpairButton.propTypes = {
    serial: PropTypes.string.isRequired,
    unpairDevice: PropTypes.func.isRequired,
};

function UnpairButton({ serial, unpairDevice }) {
    return (
        <Button onClick={() => unpairDevice({ suffix: serial })}>
            {_("Unpair device")}
        </Button>
    );
}

AcceptButton.propTypes = {
    serial: PropTypes.string.isRequired,
    acceptDevice: PropTypes.func.isRequired,
};

function AcceptButton({ serial, acceptDevice }) {
    return (
        <Button onClick={() => acceptDevice({ suffix: serial })}>
            {_("Accept pairing request")}
        </Button>
    );
}
