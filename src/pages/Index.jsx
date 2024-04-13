import React, { useState } from "react";
import { Box, Heading, Input, Button, Text, VStack, HStack, Divider, useToast } from "@chakra-ui/react";

const Index = () => {
  const [name, setName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [location, setLocation] = useState("");
  const [searchIdNumber, setSearchIdNumber] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/lostIds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, idNumber, location }),
      });
      if (response.ok) {
        toast({
          title: "ID details uploaded.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setName("");
        setIdNumber("");
        setLocation("");
      } else {
        toast({
          title: "Failed to upload ID details.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error uploading ID details:", error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/lostIds/${searchIdNumber}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResult(data);
      } else {
        setSearchResult(null);
      }
    } catch (error) {
      console.error("Error searching for ID:", error);
    }
  };

  return (
    <Box maxWidth="600px" margin="auto" padding="20px">
      <Heading as="h1" size="xl" textAlign="center" marginBottom="20px">
        Lost ID Recovery
      </Heading>

      <VStack spacing={6} align="stretch">
        <Box>
          <Heading as="h2" size="lg" marginBottom="10px">
            Upload Lost ID Details
          </Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input placeholder="ID Number" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} required />
              <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
              <Button type="submit" colorScheme="blue">
                Upload
              </Button>
            </VStack>
          </form>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" marginBottom="10px">
            Search for Lost ID
          </Heading>
          <form onSubmit={handleSearch}>
            <HStack spacing={4}>
              <Input placeholder="ID Number" value={searchIdNumber} onChange={(e) => setSearchIdNumber(e.target.value)} required />
              <Button type="submit" colorScheme="blue">
                Search
              </Button>
            </HStack>
          </form>
          {searchResult && <Box marginTop="20px">{searchResult.found ? <Text>The ID is available and can be picked up at {searchResult.location}.</Text> : <Text>Sorry, the ID is not available. Please try again later.</Text>}</Box>}
        </Box>
      </VStack>
    </Box>
  );
};

export default Index;
