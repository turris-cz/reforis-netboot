#  Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

from pathlib import Path
from http import HTTPStatus

from flask import Blueprint, current_app, jsonify, request
from flask_babel import gettext as _

from reforis.foris_controller_api.utils import log_error, validate_json, APIError

# pylint: disable=invalid-name
blueprint = Blueprint(
    'Netboot',
    __name__,
    url_prefix='/netboot/api',
)

BASE_DIR = Path(__file__).parent

# pylint: disable=invalid-name
netboot = {
    'blueprint': blueprint,
    # Define {python_module_name}/js/app.min.js
    # See https://gitlab.labs.nic.cz/turris/reforis/reforis-distutils/blob/master/reforis_distutils/__init__.py#L11
    'js_app_path': 'reforis_netboot/js/app.min.js',
    'translations_path': BASE_DIR / 'translations',
}


@blueprint.route('/devices', methods=['GET'])
def get_devices():
    return jsonify(current_app.backend.perform('netboot', 'list')['devices'])


@blueprint.route('/accept/<serial>', methods=['PUT'])
def accept_device(serial):
    response = current_app.backend.perform('netboot', 'accept', {'serial': serial})
    if response.get('task_id') is None:
        raise APIError(_('Cannot accept pairing request.'), HTTPStatus.INTERNAL_SERVER_ERROR)
    return '', HTTPStatus.NO_CONTENT


@blueprint.route('/unpair/<serial>', methods=['PUT'])
def unpair_device(serial):
    response = current_app.backend.perform('netboot', 'revoke', {'serial': serial})
    if response.get('result') is not True:
        raise APIError(_('Cannot unpair devices.'), HTTPStatus.INTERNAL_SERVER_ERROR)
    return '', HTTPStatus.NO_CONTENT
