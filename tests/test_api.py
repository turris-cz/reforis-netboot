#  Copyright (C) 2020-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

from http import HTTPStatus
from reforis.test_utils import mock_backend_response


@mock_backend_response({"netboot": {"list": {"devices": ["foo", "bar"]}}})
def test_get_devices(client):
    response = client.get("/netboot/api/devices")
    assert response.status_code == HTTPStatus.OK
    assert response.json == ["foo", "bar"]


@mock_backend_response({"netboot": {"accept": {"task_id": "1234"}}})
def test_accept_device(client):
    response = client.put("/netboot/api/accept/55d58")
    assert response.status_code == HTTPStatus.NO_CONTENT


@mock_backend_response({"netboot": {"accept": {"foo": "bar"}}})
def test_accept_device_error(client):
    response = client.put("/netboot/api/accept/55d58")
    assert response.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
    assert response.json == "Cannot accept pairing request."


@mock_backend_response({"netboot": {"revoke": {"result": True}}})
def test_unpair_device(client):
    response = client.put("/netboot/api/unpair/55d58")
    assert response.status_code == HTTPStatus.NO_CONTENT


@mock_backend_response({"netboot": {"revoke": {"foo": "bar"}}})
def test_unpair_device_error(client):
    response = client.put("/netboot/api/unpair/55d58")
    assert response.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
    assert response.json == "Cannot unpair devices."
