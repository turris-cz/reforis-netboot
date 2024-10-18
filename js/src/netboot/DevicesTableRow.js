/*
 * Copyright (C) 2020-2024 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import {
    faCheckCircle,
    faQuestionCircle,
    faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, SpinnerElement } from "foris";
import PropTypes from "prop-types";

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

const STATUS_ICON_MAP = {
    [DEVICE_STATES.ACCEPTED]: {
        icon: faCheckCircle,
        className: "text-success",
        description: _("Paired"),
    },
    [DEVICE_STATES.INCOMING]: {
        icon: faTimesCircle,
        className: "text-primary",
        description: _("Awaiting acceptance"),
    },
    default: {
        icon: faQuestionCircle,
        className: "fa-question-circle text-warning",
        description: _("Unknown status"),
    },
};

StatusIcon.propTypes = {
    status: PropTypes.string,
};

function StatusIcon({ status }) {
    const { icon, className, description } =
        STATUS_ICON_MAP[status] || STATUS_ICON_MAP.default;

    return (
        <FontAwesomeIcon
            icon={icon}
            size="lg"
            className={className}
            title={description}
        />
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
