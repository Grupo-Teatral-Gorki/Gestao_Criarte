"use client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter } from "next/router";

function setLocalCity(idCidade: string) {
  localStorage.setItem("idCidade", idCidade);
}

const city = [
  {
    id: "3842",
    city: "Serrana",
  },
  {
    id: "3798",
    city: "Santa Rita Do Passa Quatro",
  },
  {
    id: "3823",
    city: "São José Do Rio Pardo",
  },
  {
    id: "3357",
    city: "Brodowski",
  },
  {
    id: "3478",
    city: "Guariba",
  },
  {
    id: "3398",
    city: "Cerquilho",
  }
];

export default function CityFilter() {
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>("");

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
            style={{ backgroundColor: "white", cursor: "pointer" }}
          >
            {value
              ? city.find((framework) => framework.id === value)?.city
              : "Selecione uma cidade"}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command style={{ backgroundColor: "white", cursor: "pointer" }}>
            <CommandInput placeholder="Pesquise uma cidade" />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {city.map((framework) => (
                  <CommandItem
                    key={framework.id}
                    value={framework.id}
                    style={{ cursor: "pointer" }}
                    onSelect={(currentValue: string) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                      try {
                        setLocalCity(currentValue);
                        router.reload();
                      } catch (error) {
                        alert(`Não foi possível selecionar sua região: ${error}`);
                      }
                    }}
                  >
                    {framework.city}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === framework.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
