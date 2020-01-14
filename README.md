<p align="center">
  <img alt="Create ServiceNow Change Request" src="https://raw.githubusercontent.com/innovativeinnovation/create-servicenow-change-request/master/docs/readme/readme-logo.png">
</p>

<p align="center">
  Automate the creation of a change request in ServiceNow.
</p>

<p align="center">
  <a href="https://travis-ci.org/innovativeinnovation/create-servicenow-change-request">
    <img alt="Travis Status" src="https://travis-ci.org/innovativeinnovation/create-servicenow-change-request.svg?branch=master">
  </a>
  <a href="https://coveralls.io/github/innovativeinnovation/create-servicenow-change-request?branch=master">
    <img alt="Coverage Status" src="https://coveralls.io/repos/github/innovativeinnovation/create-servicenow-change-request/badge.svg?branch=master"/>
  </a>
  <a href="https://david-dm.org/innovativeinnovation/create-servicenow-change-request">
    <img alt="Dependencies Status" src="https://david-dm.org/innovativeinnovation/create-servicenow-change-request/status.svg"/>
  </a>
  <a href="https://raw.githubusercontent.com/innovativeinnovation/create-servicenow-change-request/master/LICENSE">
    <img alt="Apache License 2.0" src="https://img.shields.io/badge/license-Apache%202.0-blue.svg">
  </a>
  <a href='https://www.npmjs.com/package/create-servicenow-change-request'>
    <img alt="NPM Version" src="https://img.shields.io/npm/v/create-servicenow-change-request.svg"/>
  </a>
</p>

---

Overview
--------

This tool automate the creation of a change request in ServiceNow.

* The planned and work start date is set to current date.
* The planned and work end date is set to current date plus 5 minutes.

Install
-------

Install this globally and you'll have access to the
`create-servicenow-change-request` command anywhere on your system.

```bash
npm i create-servicenow-change-request -g
```

Configuration
-------------

### User configuration file

Create a yaml file with following informations:

```yaml
# ServiceNow host
host:

# ServiceNow id and name
id:
name:

# Tequila
username:
token:
key:
```

### Application configuration file

Create a yaml file with following informations:

```yaml
# Business Service id and name
id:
name:

# Assignment group id and name
group_id:
group_name:

# Version prefix
prefix:
```

### Usage

```console
csncr -h
Usage: csncr -u user.yml -a app.yml -l CHANGELOG.md

Options:
  -u, --user-config  User configuration file               [string] [required]
  -a, --app-config   Application configuration file        [string] [required]
  -l, --changelog    CHANGELOG.md file                     [string] [required]
  -h, --help         Show help                                       [boolean]
  -v, --version      Show version number                             [boolean]

Examples:
  csncr -u user.yml -a memento.yml -l CHANGELOG.md
  csncr -u user.yml -a rdp.yml -l CHANGELOG.md
```

Contributing
------------

Contributions are always welcome.

See [Contributing](CONTRIBUTING.md).

Developer
---------

  * [William Belle](https://github.com/williambelle)

License
-------

Apache License 2.0

(c) William Belle, 2019-2020.

See the [LICENSE](LICENSE) file for more details.
