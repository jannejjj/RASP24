import { useRef, useEffect, useState, useMemo } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import { debounce } from '@mui/material/utils';
import TextField from '@mui/material/TextField';
import parse from "autosuggest-highlight/parse";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const autocompleteService = { current: null };

function AutocompleteInput(props) {
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);

  const fetch = useMemo(
    () =>
      debounce((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 400),
    [],
  );

  useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue, language: "en", componentRestrictions: {country: "fi"}}, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <Autocomplete
      id="location"
      sx={{width: "100%", m: 0.5}}
      getOptionLabel={(option) => 
        typeof option === "string" ? option : option.description
      }
      options={options}
      autoComplete
      value={value}
      noOptionsText="No results found"
      onChange={(event, newValue) => {
        event.preventDefault();
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        props.handleLocationChange(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Location" fullWidth required/>
      )}
      renderOption={(props, option) => {
        const matches =
          option.structured_formatting.main_text_matched_substrings || [];

        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match) => [match.offset, match.offset + match.length]),
        );

        return (
          <li {...props}>
            <Grid container alignItems="center">
              <Grid item sx={{ display: 'flex', width: 44 }}>
                <LocationOnIcon />
              </Grid>
              <Grid item sx={{ width: 'calc(100% - 44px)'}}>
                {parts.map((part, index) => (
                  <Box
                    key={index}
                    component="span"
                    sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}
                  >
                    {part.text}
                  </Box>
                ))}
                <Typography>
                  {option.structured_formatting.secondary_text}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
      >
    </Autocomplete>
  );
}

export default AutocompleteInput;