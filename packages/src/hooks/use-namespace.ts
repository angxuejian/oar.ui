


const defaultNamespace: string = 'oar';
const statePrefix: string = 'is-';


const _bem = (namespace: string, block: string, blockSuffix: string, element: string, modifier: string): string => {
    let cls = `${namespace}-${block}`

    if (blockSuffix) {
        cls += `-${blockSuffix}`
    }
    if (element) {
        cls += `__${element}`
    }
    if (modifier) {
        cls += `--${modifier}`
    }
    return cls;
}

export function useNamespace(block: string) {
    return {
        b: (blockSuffix: string = '') => _bem(defaultNamespace, block, blockSuffix, '', ''),
        e: (element?: string) => element ? _bem(defaultNamespace, block, '', element, '') : '',
        m: (modifier?: string) => modifier ? _bem(defaultNamespace, block, '', '', modifier) : '',
        em: (element: string, modifier: string) => _bem(defaultNamespace, block, '', element, modifier),

        is: (name: string, isValue: boolean) => {

            return name && isValue ? statePrefix + name : ''
        }
    }
}
