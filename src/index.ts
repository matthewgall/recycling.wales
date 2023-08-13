/**
 * Copyright 2020 - 2023 Matthew Gall

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License. 
*/
import { Router } from 'itty-router';
import Mapping from './mapping.json';
import Package from '../package.json';

const router = Router();

function getMapping(target: any) {
    for (let o of Object.keys(Mapping)) {
        if (Mapping[o].keys.includes(target)) {
            return Mapping[o].location
        }
    }
    return false;
}

router.get('/version', (request, env, context) => {
    return new Response(Package.version, {headers: {'Content-Type': 'text/plain'}});
})

router.get('/', (request, env, context) => {
    // First, we now check for subdomain support
    let target = new URL(request.url).hostname.replace('.recycling.wales', '')

    // They didn't specify one, so we'll deliver the default response
    if (target == '') return new Response(`Welcome to ${Package.name}`);

    // Otherwise, time to send them to the right place
    let mapping = getMapping(target)
    if (mapping) {
        return new Response('Redirecting...', { status: 301, headers: {
            'Location': mapping
        }})
    }
    else {
        return new Response(`Welcome to ${Package.name}`);
    }
})

router.get('/*', async (request, env, context) => {
    // First, we test the path
    let target = decodeURIComponent(new URL(request.url).pathname.replace('/', ''))
    
    // They didn't specify one, so we'll deliver the default response
    if (target == '') return new Response(`Welcome to ${Package.name}`);

    // Otherwise, time to send them to the right place
    let mapping = getMapping(target)
    if (mapping) {
        return new Response('Redirecting...', { status: 301, headers: {
            'Location': mapping
        }})
    }
    else {
        return new Response(`Welcome to ${Package.name}`);
    }
});

router.all('*', () => new Response('Not Found.', { status: 404 }))

export default {
    fetch: router.handle
  }