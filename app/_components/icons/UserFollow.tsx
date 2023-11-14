import { SVGProps } from 'react';

export default function CilUserFollow(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 512 512"
            {...props}
        >
            <path
                fill="currentColor"
                d="M208 16A112.127 112.127 0 0 0 96 128v79.681a80.236 80.236 0 0 0 9.768 38.308l27.455 50.333L60.4 343.656A79.725 79.725 0 0 0 24 410.732V496h288v-32H56v-53.268a47.836 47.836 0 0 1 21.841-40.246l97.66-63.479l-41.64-76.341A48.146 48.146 0 0 1 128 207.681V128a80 80 0 0 1 160 0v79.681a48.146 48.146 0 0 1-5.861 22.985L240.5 307.007l71.5 46.476v-38.166l-29.223-19l27.455-50.334A80.23 80.23 0 0 0 320 207.681V128A112.127 112.127 0 0 0 208 16Zm216 384v-64h-32v64h-64v32h64v64h32v-64h64v-32h-64z"
            ></path>
        </svg>
    );
}