/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { useEffect, useCallback } from "react";
import {
    useWSForisModule,
    useAlert,
    API_STATE,
    useAPIGet,
    useAPIPut,
} from "foris";

import API_URLs from "API";
import DEVICE_STATES from "./deviceStates";

export function useLoadDevices(setDevices) {
    const [getDevicesResponse, getDevices] = useAPIGet(API_URLs.devices);

    // Initial data fetch
    useEffect(() => {
        getDevices();
    }, [getDevices]);

    // Update devices data
    useEffect(() => {
        if (getDevicesResponse.state === API_STATE.SUCCESS) {
            setDevices(getDevicesResponse.data);
        }
    }, [getDevicesResponse, setDevices]);

    return getDevicesResponse.state;
}

export function useAcceptDevice() {
    const [setAlert] = useAlert();

    const [acceptDeviceResponse, acceptDevice] = useAPIPut(
        `${API_URLs.accept}`
    );
    useEffect(() => {
        if (acceptDeviceResponse.state === API_STATE.ERROR) {
            setAlert(acceptDeviceResponse.data);
        }
    }, [acceptDeviceResponse, setAlert]);

    return [acceptDeviceResponse.state, acceptDevice];
}

export function useUpdateOnAccept(ws, setDevices) {
    const [setAlert] = useAlert();

    // Update devices data
    const editDevice = useCallback(
        (serial, status) => {
            setDevices((previousDevices) => {
                const devices = [...previousDevices];
                const editIndex = devices.findIndex(
                    (device) => device.serial === serial
                );
                if (editIndex !== -1) {
                    const device = { ...devices[editIndex] };

                    if (status === "started") {
                        device.state = DEVICE_STATES.TRANSFERING;
                    } else if (status === "succeeded") {
                        device.state = DEVICE_STATES.ACCEPTED;
                    } else if (status === "failed") {
                        setAlert(_("Cannot pair devices."));
                        device.state = DEVICE_STATES.INCOMING;
                    }

                    devices[editIndex] = device;
                }
                return devices;
            });
        },
        [setAlert, setDevices]
    );

    const [acceptNotification] = useWSForisModule(ws, "netboot", "accept");
    useEffect(() => {
        if (!acceptNotification) {
            return;
        }
        editDevice(acceptNotification.serial, acceptNotification.status);
    }, [editDevice, acceptNotification]);
}

export function useUnpairDevice() {
    const [setAlert] = useAlert();

    const [unpairDeviceResponse, unpairDevice] = useAPIPut(
        `${API_URLs.unpair}`
    );
    useEffect(() => {
        if (unpairDeviceResponse.state === API_STATE.ERROR) {
            setAlert(unpairDeviceResponse.data);
        }
    }, [unpairDeviceResponse, setAlert]);

    return [unpairDeviceResponse.state, unpairDevice];
}

export function useUpdateOnUnpair(ws, setDevices) {
    const [unpairNotification] = useWSForisModule(ws, "netboot", "revoke");

    // Update devices data
    const removeDeviceFromTable = useCallback(
        (serial) => {
            setDevices((previousDevices) => {
                const devices = [...previousDevices];
                const deleteIndex = devices.findIndex(
                    (device) => device.serial === serial
                );
                if (deleteIndex !== -1) {
                    devices.splice(deleteIndex, 1);
                }
                return devices;
            });
        },
        [setDevices]
    );

    useEffect(() => {
        if (!unpairNotification) {
            return;
        }
        removeDeviceFromTable(unpairNotification.serial);
    }, [removeDeviceFromTable, unpairNotification]);
}
