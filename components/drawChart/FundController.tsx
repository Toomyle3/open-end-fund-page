"use client";
import { cn } from "@/lib/utils";
import { CaretSortIcon } from "@radix-ui/react-icons";
import "../index.css";
import { Checkbox } from "../ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Label } from "../ui/label";

interface Fund {
  name: string;
}

interface FundsByType {
  [key: string]: Fund[];
}

interface FundControllerProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fundsByType: FundsByType;
  selectedFunds: string[];
  setSelectedFunds: React.Dispatch<React.SetStateAction<string[]>>;
}

const FundController = ({
  isOpen,
  setIsOpen,
  fundsByType,
  selectedFunds,
  setSelectedFunds,
}: FundControllerProps) => {
  return (
    <div className="pt-10 w-full flex max-w-[800px]">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className={cn("w-full bg-gray-600 text-white rounded", {
          "h-[50px]": !isOpen,
        })}
      >
        <CollapsibleTrigger asChild className="flex cursor-pointer">
          <div className="flex items-center justify-between px-4 h-[50px]">
            <h4 className="font-[500] font-serif pl-[20px]">Show All Funds</h4>
            <CaretSortIcon className="h-6 w-6" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent
          style={{
            padding: "0px 40px 40px 40px",
          }}
          className="collapsible-items w-full flex justify-center items-center gap-4"
        >
          <div
            className="w-full
          sm:flex sm:justify-around
           grid grid-cols-2 
          gap-6 sm:grid-cols-4 
          max-h-[500px] overflow-auto
          pt-4"
          >
            {Object.keys(fundsByType).map((type) => (
              <div key={type} className="flex flex-col gap-2">
                <h2 className="flex font-serif justify-start text-lg font-[500] mb-4">
                  {type}
                </h2>
                {fundsByType[type].map((fund: any) => (
                  <div
                    key={fund.name}
                    className="font-serif flex items-center gap-4"
                  >
                    <Checkbox
                      id={fund.name}
                      className="bg-white"
                      checked={selectedFunds.includes(fund.name)}
                      onCheckedChange={(value) => {
                        if (value) {
                          setSelectedFunds((prev) => {
                            return [...prev, fund.name];
                          });
                        } else {
                          setSelectedFunds((prev) => {
                            return prev.filter((value) => value !== fund.name);
                          });
                        }
                      }}
                    />
                    <Label
                      htmlFor={fund.name}
                      className="text-sm font-medium leading-none"
                    >
                      {fund.name}
                    </Label>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default FundController;
