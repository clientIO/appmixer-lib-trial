'use strict';

/**
 * Returns generator, which loops over unique input links
 * componentId+outPort is the key to uniqueness
 * @param {Object} source
 * @param {boolean} [checkUniqueIdPort]
 * @yield {{
 *        id: string,
 *        port: string,
 *        inPortName: string
 *        }}
 */
function* allInputLinks(source, checkUniqueIdPort = true) {

    const resolvedScopes = new Set();
    // loop through input ports
    for (let portName in source) {
        if (!source.hasOwnProperty(portName)) {
            continue;
        }
        const inPortSource = source[portName];
        // loop through input port links
        for (let id in inPortSource) {
            if (!inPortSource.hasOwnProperty(id)) {
                continue;
            }
            const ports = Array.isArray(inPortSource[id]) ? inPortSource[id] : [inPortSource[id]];
            for (let port of ports) {
                const hash = id + port;
                // check for duplicities
                if (checkUniqueIdPort && resolvedScopes.has(hash)) {
                    continue;
                }
                resolvedScopes.add(hash);
                yield {
                    id,
                    port,
                    inPortName: portName
                };
            }
        }
    }
}

/**
 * Returns generator, which loops over all output links from a component's output port.
 * @param {Object} descriptor
 * @param {string} cid - component Id
 * @param {string} outputPort
 * @return {Iterator<*>}
 */
function* allOutputLinks(descriptor, cid, outputPort) {

    for (let componentId in descriptor) {
        if (!descriptor.hasOwnProperty(componentId)) {
            continue;
        }

        let source = descriptor[componentId].source;
        for (let inputPort in source) {
            if (!source.hasOwnProperty(inputPort)) {
                continue;
            }

            let sourceInput = source[inputPort];
            for (let sourceComponentId in sourceInput) {
                if (!sourceInput.hasOwnProperty(sourceComponentId)) {
                    continue;
                }

                if (sourceComponentId !== cid) {
                    continue;
                }

                const ports = Array.isArray(sourceInput[sourceComponentId]) ?
                    sourceInput[sourceComponentId] : [sourceInput[sourceComponentId]];

                if (ports.indexOf(outputPort) !== -1) {
                    yield {
                        componentId,
                        inputPort
                    };
                }
            }
        }
    }
}

module.exports = {
    ComponentDescriptor: {
        allInputLinks,
        allOutputLinks
    }
};
