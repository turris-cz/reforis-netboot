/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import Netboot from "./netboot/Netboot";

const NetbootPlugin = {
    name: _("Netboot"),
    submenuId: "remote-devices",
    weight: 102,
    path: "/netboot",
    component: Netboot,
};

ForisPlugins.push(NetbootPlugin);
