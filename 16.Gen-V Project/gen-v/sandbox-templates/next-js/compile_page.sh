#!/bin/bash

# Starts the Next.js dev server and warms up the `/` route so the first preview
# load isn't a cold compile.
function ping_server() {
	counter=0
	response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000")
	while [[ ${response} -ne 200 ]]; do
	  let counter++
	  if  (( counter % 20 == 0 )); then
        echo "Waiting for server to start..."
        sleep 0.1
      fi

	  response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000")
	done
}

cd /home/user || exit 1

# A .next cache captured in the template snapshot can be stale or reference the
# pre-flatten path, which surfaces as "Failed to write app endpoint /page".
rm -rf /home/user/.next

ping_server &

exec npx next dev --turbopack --port 3000 --hostname 0.0.0.0
