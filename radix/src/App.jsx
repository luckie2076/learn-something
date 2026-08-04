import { Popover } from "radix-ui";

const PopoverDemo = ( {children}  ) => (
  <>
	<Popover.Root>
		<Popover.Trigger className="bg-red-500">更多信息</Popover.Trigger>
		<Popover.Portal>
			<Popover.Content>
				更多信息…
				<Popover.Arrow />
			</Popover.Content>
		</Popover.Portal>
	</Popover.Root>
  </>
);

export default PopoverDemo;
