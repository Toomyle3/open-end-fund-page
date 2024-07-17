#!/bin/bash
file="/opt/migrations/stock/migration/config/flyway.conf"
if [ -f "$file" ]
then
  flyway migrate -configFiles=/opt/migrations/stock/migration/config/flyway.conf
else
	echo "ERROR: fail to run. $file not found."
fi
