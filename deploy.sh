#!/bin/sh
# Runs on the FreeBSD server: sh /root/setup/deploy.sh
# The body is wrapped in braces so sh reads the whole script before "git pull" can rewrite this file.
{
  set -eu
  cd "$(dirname "$0")"

  git pull --ff-only
  deno install --frozen
  deno task --cwd=frontend build

  # The service is (re)installed on every deploy, so changes to the rc.d script are picked up too.
  install -m 755 rc.d/sender /usr/local/etc/rc.d/
  sysrc sender_enable=YES

  service sender restart

  exit
}
