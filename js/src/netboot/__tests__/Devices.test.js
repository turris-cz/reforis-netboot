/*
 * Copyright (C) 2020-2024 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import mockAxios from "jest-mock-axios";
import {
    render,
    act,
    wait,
    waitForElement,
    getByText,
    getByTitle,
    getAllByTitle,
    getByRole,
    queryByText,
    fireEvent,
} from "foris/testUtils/customTestRender";
import { mockJSONError } from "foris/testUtils/network";
import { mockSetAlert } from "foris/testUtils/alertContextMock";
import { WebSockets } from "foris";

import devices from "./__fixtures__/devices";
import Devices from "../Devices";

describe("<Devices />", () => {
    let container;
    let webSockets;

    beforeEach(() => {
        webSockets = new WebSockets();
        ({ container } = render(<Devices ws={webSockets} />));
    });

    it("should render spinner", () => {
        expect(container).toMatchSnapshot();
    });

    it("should render table", async () => {
        expect(mockAxios.get).toBeCalledWith(
            "/reforis/netboot/api/devices",
            expect.anything()
        );
        mockAxios.mockResponse({ data: devices });
        await waitForElement(() => getByText(container, devices[0].serial));
        expect(container).toMatchSnapshot();
    });

    it("should handle GET error", async () => {
        mockJSONError();
        await wait(() =>
            expect(
                getByText(container, "An error occurred while fetching data.")
            ).toBeTruthy()
        );
    });

    describe("accept", () => {
        let acceptButton;

        beforeEach(async () => {
            mockAxios.mockResponse({ data: devices });
            await waitForElement(() => getByText(container, devices[0].serial));
            acceptButton = getByText(container, "Accept pairing request");
        });

        it("should handle API error", async () => {
            // Unpair device
            fireEvent.click(acceptButton);
            expect(mockAxios.put).toBeCalledWith(
                `/reforis/netboot/api/accept/${devices[0].serial}`,
                undefined,
                expect.anything()
            );
            // Handle error
            const errorMessage = "API didn't handle this well";
            mockJSONError(errorMessage);
            await wait(() => {
                expect(mockSetAlert).toHaveBeenCalledWith(errorMessage);
            });
            // expect icon <i> with class .fa to be defined
            expect(document.querySelector(".fa")).toBeDefined();
        });

        it("should display spinner during request", async () => {
            fireEvent.click(acceptButton);
            expect(container).toMatchSnapshot();
        });

        it("should display spinner while processing acceptance request", async () => {
            fireEvent.click(acceptButton);
            mockAxios.mockResponse({ data: { task_id: "5542" } });
            await waitForElement(() => getByText(container, devices[0].serial));
            act(() =>
                webSockets.dispatch({
                    module: "netboot",
                    action: "accept",
                    data: { serial: devices[0].serial, status: "started" },
                })
            );
            expect(getByRole(container, "status")).toBeDefined();
        });

        it("should handle succesfully processed acceptance request", async () => {
            expect(document.querySelector(".fa")).toBeDefined();
            fireEvent.click(acceptButton);
            mockAxios.mockResponse({ data: { task_id: "5542" } });
            await waitForElement(() => getByText(container, devices[0].serial));
            act(() =>
                webSockets.dispatch({
                    module: "netboot",
                    action: "accept",
                    data: { serial: devices[0].serial, status: "succeeded" },
                })
            );
            expect(document.querySelector(".fa")).toBeDefined();
        });

        it("should handle failed acceptance request", async () => {
            fireEvent.click(acceptButton);
            mockAxios.mockResponse({ data: { task_id: "5542" } });
            await waitForElement(() => getByText(container, devices[0].serial));
            act(() =>
                webSockets.dispatch({
                    module: "netboot",
                    action: "accept",
                    data: { serial: devices[0].serial, status: "failed" },
                })
            );
            expect(mockSetAlert).toHaveBeenCalledWith("Cannot pair devices.");
            // Request didn't change its status
            expect(document.querySelector(".fa")).toBeDefined();
        });
    });

    describe("unpair", () => {
        let unpairButton;

        beforeEach(async () => {
            mockAxios.mockResponse({ data: devices });
            await waitForElement(() => getByText(container, devices[1].serial));
            unpairButton = getByText(container, "Unpair device");
        });

        it("should handle API error", async () => {
            // Unpair device
            fireEvent.click(unpairButton);
            expect(mockAxios.put).toBeCalledWith(
                `/reforis/netboot/api/unpair/${devices[1].serial}`,
                undefined,
                expect.anything()
            );
            // Handle error
            const errorMessage = "API didn't handle this well";
            mockJSONError(errorMessage);
            await wait(() => {
                expect(mockSetAlert).toHaveBeenCalledWith(errorMessage);
            });
        });

        it("should display spinner during request", async () => {
            fireEvent.click(unpairButton);
            expect(container).toMatchSnapshot();
        });

        it("should remove device from table on success", async () => {
            fireEvent.click(unpairButton);
            mockAxios.mockResponse({ data: { result: true } });
            await waitForElement(() => getByText(container, devices[1].serial));
            act(() =>
                webSockets.dispatch({
                    module: "netboot",
                    action: "revoke",
                    data: { serial: devices[1].serial },
                })
            );
            await wait(() =>
                expect(queryByText(container, devices[1].serial)).toBeNull()
            );
        });
    });
});
