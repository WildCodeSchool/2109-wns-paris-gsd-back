Review checklist:

- [ ] branch are rebased on last version of master
- [ ] conventions has been respected:
    - [ ] git naming rules
    - [ ] coding style (linter has been executed)
- [ ] new code is covered by tests & all tests are green
- [ ] code has been tested locally and on staging (if available)
- [ ] branch is fully mergeable or feature flipping is enabled
- [ ] changes can be tested
- [ ] configuration changes is replicated in deploy scripts
<!-- - [ ] PO is aware of what i have done -->

---- erase this line and all texts above ----

## Goal

Provide helpful summary of what you are trying to achieve.

## How to test

### Automatic test

[![SCOPE Test](https://github.com/WildCodeSchool/2109-wns-paris-gsd-back/actions/workflows/WORKFLOW_FILE.yml/badge.svg?branch=BRANCH-NAME)](https://github.com/WildCodeSchool/2109-wns-paris-gsd-back/actions/workflows/WORKFLOW_FILE.yml)

### Manuel test

Provide details on how to test your work.

## What to expect

Explain what the reviewer is supposed to see whilst testing your work.

## How to monitor (aka what could go wrong ?)

Explain how to monitor once code is live

## Critical barometer

Pick one of:
- :ok_hand: code safe, none or little impact on live applications
- :metal: medium impact on live applications
- :exclamation: high impact on live applications, test and deploy with care
- :fire: DO NOT MERGE :fire:
