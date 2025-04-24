import * as Slider from "@radix-ui/react-slider";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import type * as schema from "@wsh-2025/schema/src/api/schema";
import type React from "react";
import { useState } from "react";
import invariant from "tiny-invariant";

import { useCurrentTime } from "@wsh-2025/client/src/pages/episode/hooks/useCurrentTime";
import { useDuration } from "@wsh-2025/client/src/pages/episode/hooks/useDuration";

const SEEK_THUMBNAIL_WIDTH = 160;
const MIN_LEFT = SEEK_THUMBNAIL_WIDTH / 2;

interface Props {
	episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

export const SeekThumbnail = ({ episode }: Props) => {
	const duration = useDuration();
	const [currentTime, updateCurrentTime] = useCurrentTime();

	const [relativeX, setRelativeX] = useState(0);
	const [pointedTime, setPointedTime] = useState(0);
	const [maxLeft, setMaxLeft] = useState(0);

	const handleMouseOver = (event: React.MouseEvent<HTMLDivElement>) => {
		const elementRect = (
			event.target as HTMLDivElement
		).getBoundingClientRect();
		const pointerX = event.clientX;

		setRelativeX(pointerX - elementRect.left);
		setMaxLeft(elementRect.width - SEEK_THUMBNAIL_WIDTH / 2);

		const percentage = Math.max(0, Math.min(relativeX / elementRect.width, 1));
		setPointedTime(duration * percentage);

		console.log(elementRect, pointerX, relativeX, percentage);
	};

	return (
		<div className="group relative size-full" onMouseMove={handleMouseOver}>
			<div className="pointer-events-none relative size-full opacity-0 group-hover:opacity-100">
				<div
					className="absolute h-[90px] w-[160px] bg-[size:auto_100%] bottom-0 translate-x-[-50%]"
					style={{
						backgroundPositionX:
							-1 * SEEK_THUMBNAIL_WIDTH * Math.floor(pointedTime),
						left: Math.max(MIN_LEFT, Math.min(relativeX, maxLeft)),
						backgroundImage: `url(/public/previews/${episode.streamId}.jpeg)`,
					}}
				/>
			</div>
			<Slider.Root
				className="group relative flex h-[20px] w-full cursor-pointer touch-none select-none flex-row items-center"
				max={duration}
				min={0}
				orientation="horizontal"
				value={[currentTime]}
				onValueChange={([t]) => {
					invariant(t);
					updateCurrentTime(t);
				}}
			>
				<Slider.Track className="grow-1 relative h-[2px] rounded-[4px] bg-[#999999] group-hover:h-[4px]">
					<Slider.Range className="absolute h-[2px] rounded-[4px] bg-[#1c43d1] group-hover:h-[4px]" />
				</Slider.Track>
				<Slider.Thumb className="block size-[20px] rounded-[10px] bg-[#1c43d1] opacity-0 focus:outline-none group-hover:opacity-100" />
			</Slider.Root>
		</div>
	);
};
